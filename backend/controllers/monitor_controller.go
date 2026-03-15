package controllers

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"gorm.io/gorm"
)


// GetMonitors godoc
// GET /api/monitors
func GetMonitors(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var monitors []models.Monitor
	// Preload last 20 ping logs for each monitor to show sparklines
	config.DB.Where("user_id = ?", userID).
		Preload("PingLogs", func(db *gorm.DB) *gorm.DB {
			return db.Order("recorded_at desc").Limit(20)
		}).
		Find(&monitors)

	// Since we fetched DESC for LIMIT 20, we should reverse them for the chart UI (chronological)
	for i := range monitors {
		logs := monitors[i].PingLogs
		for j, k := 0, len(logs)-1; j < k; j, k = j+1, k-1 {
			logs[j], logs[k] = logs[k], logs[j]
		}
	}

	return c.JSON(monitors)
}


// GetMonitorByID godoc
// GET /api/monitors/:id
func GetMonitorByID(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")
	period := c.Query("period", "realtime") // realtime, 24h, 7d, 30d

	var monitor models.Monitor
	if err := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&monitor).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Monitor not found"})
	}

	// Fetch logs based on period with aggregation to avoid lag
	type AggregatedResult struct {
		RecordedAt string  `gorm:"column:recorded_at"`
		LatencyMs  float64 `gorm:"column:latency_ms"`
		IsSuccess  int     `gorm:"column:is_success"`
	}
	var aggResults []AggregatedResult

	switch period {
	case "24h":
		// Group by hour
		sql := `SELECT DATE_FORMAT(recorded_at, '%Y-%m-%d %H:00:00') as recorded_at, AVG(latency_ms) as latency_ms, MIN(is_success) as is_success 
				FROM ping_logs 
				WHERE monitor_id = ? AND recorded_at >= ? 
				GROUP BY 1 ORDER BY 1 ASC`
		config.DB.Raw(sql, monitor.ID, time.Now().Add(-24*time.Hour)).Scan(&aggResults)
	case "7d":
		// Group by 6-hour blocks
		sql := `SELECT DATE_FORMAT(FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(recorded_at)/(3600*6))*3600*6), '%Y-%m-%d %H:%i:%s') as recorded_at, AVG(latency_ms) as latency_ms, MIN(is_success) as is_success 
				FROM ping_logs 
				WHERE monitor_id = ? AND recorded_at >= ? 
				GROUP BY 1 ORDER BY 1 ASC`
		config.DB.Raw(sql, monitor.ID, time.Now().Add(-7*24*time.Hour)).Scan(&aggResults)
	case "30d":
		// Group by day
		sql := `SELECT DATE_FORMAT(recorded_at, '%Y-%m-%d 00:00:00') as recorded_at, AVG(latency_ms) as latency_ms, MIN(is_success) as is_success 
				FROM ping_logs 
				WHERE monitor_id = ? AND recorded_at >= ? 
				GROUP BY 1 ORDER BY 1 ASC`
		config.DB.Raw(sql, monitor.ID, time.Now().Add(-30*24*time.Hour)).Scan(&aggResults)
	default:
		// realtime: last 50 raw logs (reversed later)
		var rawPings []models.PingLog
		config.DB.Where("monitor_id = ?", monitor.ID).Order("recorded_at desc").Limit(50).Find(&rawPings)
		// Reverse only for realtime since others are ordered ASC by Grouping
		for i, j := 0, len(rawPings)-1; i < j; i, j = i+1, j-1 {
			rawPings[i], rawPings[j] = rawPings[j], rawPings[i]
		}
		monitor.PingLogs = rawPings
		return c.JSON(monitor)
	}

	// Map aggregated results back to models.PingLog
	var pings []models.PingLog
	for _, res := range aggResults {
		t, err := time.Parse("2006-01-02 15:04:05", res.RecordedAt)
		if err != nil {
			// Fallback (should not be needed with DATE_FORMAT)
			t, _ = time.Parse("2006-01-02", res.RecordedAt)
		}
		pings = append(pings, models.PingLog{
			RecordedAt: t,
			LatencyMs:  int(res.LatencyMs),
			IsSuccess:  res.IsSuccess == 1,
		})
	}
	
	if len(pings) == 0 {
		// Log for debugging if empty
		println("DEBUG: No pings found for monitor", monitor.ID, "period", period)
	}

	monitor.PingLogs = pings
	return c.JSON(monitor)
}

// GetMonitorLogs godoc
// GET /api/monitors/:id/logs?page=1&limit=50&status=all
func GetMonitorLogs(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 50)
	statusTab := c.Query("status", "all") // all, ok, fail

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50
	}

	offset := (page - 1) * limit

	var monitor models.Monitor
	if err := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&monitor).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Monitor not found"})
	}

	query := config.DB.Model(&models.PingLog{}).Where("monitor_id = ?", monitor.ID)

	if statusTab == "ok" {
		query = query.Where("is_success = ?", true)
	} else if statusTab == "fail" {
		query = query.Where("is_success = ?", false)
	}

	var total int64
	query.Count(&total)

	var logs []models.PingLog
	query.Order("recorded_at desc").Offset(offset).Limit(limit).Find(&logs)

	return c.JSON(fiber.Map{
		"logs":        logs,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"totalPages":  (total + int64(limit) - 1) / int64(limit),
	})
}




// CreateMonitor godoc
// POST /api/monitors
func CreateMonitor(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	monitor := new(models.Monitor)
	if err := c.BodyParser(monitor); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// Validate required fields
	monitor.Name = strings.TrimSpace(monitor.Name)
	monitor.Target = strings.TrimSpace(monitor.Target)

	if monitor.Name == "" || monitor.Target == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name and Target are required"})
	}

	// ===== PLAN ENFORCEMENT =====
	// Get the user's current plan name
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot find user"})
	}

	// Find matching plan by exact name (LOWER() doesn't work reliably for Vietnamese Unicode)
	var plan models.Plan
	planFound := config.DB.Where("name = ?", user.Plan).First(&plan).Error == nil

	// Fallback: if user.Plan doesn't match any plan name (e.g. legacy 'free'), use the default plan
	if !planFound {
		planFound = config.DB.Where("is_default = ?", true).First(&plan).Error == nil
	}

	if planFound && plan.MaxMonitors > 0 {
		// Count current monitors
		var count int64
		config.DB.Model(&models.Monitor{}).Where("user_id = ?", userID).Count(&count)
		if int(count) >= plan.MaxMonitors {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Bạn đã đạt giới hạn số Monitor tối đa của gói hiện tại. Vui lòng nâng cấp gói để tạo thêm.",
				"limit": plan.MaxMonitors,
				"plan":  plan.Name,
			})
		}
	}
	// ===== END PLAN ENFORCEMENT =====

	// Determine defaults if empty
	if monitor.MonitorType == "" {
		monitor.MonitorType = "HTTP"
	}
	if monitor.CheckInterval == 0 {
		monitor.CheckInterval = 60
	}

	// Enforce Minimum Check Interval from Plan
	if planFound && monitor.CheckInterval < plan.CheckInterval {
		monitor.CheckInterval = plan.CheckInterval
	}

	if monitor.Timeout == 0 {
		monitor.Timeout = 30
	}
	if monitor.HTTPMethod == nil {
		defaultMethod := "GET"
		monitor.HTTPMethod = &defaultMethod
	}
	if monitor.HTTPAcceptedCodes == nil {
		defaultCodes := "200-299"
		monitor.HTTPAcceptedCodes = &defaultCodes
	}

	monitor.UserID = userID
	monitor.Status = "UP" // Initialize as UP

	if err := config.DB.Create(&monitor).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create monitor"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Monitor created successfully",
		"monitor": monitor,
	})
}

// UpdateMonitor godoc
// PUT /api/monitors/:id
func UpdateMonitor(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	var monitor models.Monitor
	if err := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&monitor).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Monitor not found"})
	}

	if err := c.BodyParser(&monitor); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := config.DB.Save(&monitor).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update monitor"})
	}

	return c.JSON(fiber.Map{
		"message": "Monitor updated successfully",
		"monitor": monitor,
	})
}

// DeleteMonitor godoc
// DELETE /api/monitors/:id
func DeleteMonitor(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	result := config.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Monitor{})
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Monitor not found"})
	}

	return c.JSON(fiber.Map{"message": "Monitor deleted successfully"})
}
