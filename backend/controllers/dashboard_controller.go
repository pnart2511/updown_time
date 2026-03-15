package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// GetDashboardData godoc
// GET /api/dashboard
func GetDashboardData(c *fiber.Ctx) error {
	// Lấy user_id từ JWT middleware
	userID := c.Locals("user_id").(uint)

	// Các biến đếm
	var totalMonitors int64
	var upMonitors int64
	var openIncidents int64

	// 1. Tổng số Monitors
	config.DB.Model(&models.Monitor{}).Where("user_id = ?", userID).Count(&totalMonitors)

	// 2. Số Monitors đang UP
	config.DB.Model(&models.Monitor{}).Where("user_id = ? AND status = ?", userID, "UP").Count(&upMonitors)

	// 3. Số Sự cố đang mở (Incidents thuộc về Monitors của user này, EndTime is null)
	// Dùng Join để đảm bảo incident này thuộc về monitor của user
	config.DB.Table("incidents").
		Joins("JOIN monitors ON incidents.monitor_id = monitors.id").
		Where("monitors.user_id = ? AND incidents.end_time IS NULL", userID).
		Count(&openIncidents)

	// 4. Tính Ping trung bình (từ PingLogs của các Monitors thuộc về user này)
	type Result struct {
		AvgPing float64
	}
	var res Result
	config.DB.Table("ping_logs").
		Select("AVG(latency_ms) as avg_ping").
		Joins("JOIN monitors ON ping_logs.monitor_id = monitors.id").
		Where("monitors.user_id = ?", userID).
		Scan(&res)

	avgPing := 0
	if res.AvgPing > 0 {
		avgPing = int(res.AvgPing)
	}

	// 5. Lấy danh sách Monitors gần đây
	var monitors []models.Monitor
	config.DB.Where("user_id = ?", userID).
		Preload("PingLogs", func(db *gorm.DB) *gorm.DB {
			return db.Order("recorded_at desc").Limit(40)
		}).
		Order("id DESC").Limit(10).Find(&monitors)

	// Format lại monitors để front-end dễ dùng
	var formattedMonitors []fiber.Map
	for _, m := range monitors {
		// Reverse logs to be chronological
		logs := m.PingLogs
		for i, j := 0, len(logs)-1; i < j; i, j = i+1, j-1 {
			logs[i], logs[j] = logs[j], logs[i]
		}

		formattedMonitors = append(formattedMonitors, fiber.Map{
			"id":             m.ID,
			"name":           m.Name,
			"target":         m.Target,
			"status":         m.Status,
			"last_checked":   m.LastCheckedAt,
			"check_interval": m.CheckInterval,
			"ping_logs":      logs,
		})
	}

	// 6. Lấy danh sách sự cố gần đây
	var incidents []models.Incident
	config.DB.Joins("JOIN monitors ON incidents.monitor_id = monitors.id").
		Where("monitors.user_id = ?", userID).
		Order("incidents.start_time DESC").
		Limit(5).
		Find(&incidents)

	// Lấy thêm tên monitor cho incident
	var formattedIncidents []fiber.Map
	for _, inc := range incidents {
		var monName string
		// Lấy tay cho nhanh (có thể tối ưu bằng Preload)
		var m models.Monitor
		config.DB.Select("name").Where("id = ?", inc.MonitorID).First(&m)
		monName = m.Name

		status := "open"
		if inc.EndTime != nil {
			status = "resolved"
		}

		formattedIncidents = append(formattedIncidents, fiber.Map{
			"id":           inc.ID,
			"monitor_name": monName,
			"start_time":   inc.StartTime,
			"end_time":     inc.EndTime,
			"status":       status,
			"cause":        inc.Cause,
		})
	}

	// Trả về JSON tổng hợp
	return c.JSON(fiber.Map{
		"stats": fiber.Map{
			"total_monitors": totalMonitors,
			"up_monitors":    upMonitors,
			"open_incidents": openIncidents,
			"avg_ping_ms":    avgPing,
		},
		"monitors":         formattedMonitors,
		"recent_incidents": formattedIncidents,
	})
}

// ─── Profile ──────────────────────────────────────────────────────────────────

func GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var dbUser models.User
	if err := config.DB.First(&dbUser, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(fiber.Map{
		"id":         dbUser.ID,
		"email":      dbUser.Email,
		"full_name":  dbUser.FullName,
		"role":       dbUser.Role,
		"plan":       dbUser.Plan,
		"created_at": dbUser.CreatedAt,
	})
}

func ChangePassword(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	type Req struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	var req Req
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.NewPassword == "" || len(req.NewPassword) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "New password must be at least 6 characters"})
	}

	var dbUser models.User
	if err := config.DB.First(&dbUser, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid current password"})
	}

	// Hash new password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	dbUser.PasswordHash = string(hash)
	if err := config.DB.Save(&dbUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update password"})
	}

	return c.JSON(fiber.Map{"message": "Password updated successfully"})
}

// UpgradePlan - POST /api/dashboard/upgrade-plan
// Allows the authenticated user to switch their active plan.
func UpgradePlan(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

	var body struct {
		PlanName string `json:"plan_name"`
	}
	if err := c.BodyParser(&body); err != nil || body.PlanName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "plan_name is required"})
	}

	// Verify plan exists
	var plan models.Plan
	if err := config.DB.Where("LOWER(name) = LOWER(?)", body.PlanName).First(&plan).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Plan không tồn tại"})
	}

	// Update user's plan field
	if err := config.DB.Model(&models.User{}).Where("id = ?", userID).Update("plan", plan.Name).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Không thể cập nhật gói"})
	}

	return c.JSON(fiber.Map{
		"message": "Kích hoạt gói thành công!",
		"plan":    plan.Name,
	})
}

