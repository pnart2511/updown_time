package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

// GetActiveLocations — GET /api/locations (any authenticated user)
func GetActiveLocations(c *fiber.Ctx) error {
	var locs []models.Location
	config.DB.Where("is_active = ?", true).Order("region ASC, name ASC").Find(&locs)
	return c.JSON(locs)
}

// ─── STATS ────────────────────────────────────────────────────────────────────


// GET /api/admin/stats
func AdminGetStats(c *fiber.Ctx) error {
	var totalUsers int64
	var totalMonitors int64
	var upMonitors int64
	var downMonitors int64
	var openIncidents int64

	config.DB.Model(&models.User{}).Count(&totalUsers)
	config.DB.Model(&models.Monitor{}).Count(&totalMonitors)
	config.DB.Model(&models.Monitor{}).Where("status = 'UP'").Count(&upMonitors)
	config.DB.Model(&models.Monitor{}).Where("status = 'DOWN'").Count(&downMonitors)
	config.DB.Model(&models.Incident{}).Where("end_time IS NULL").Count(&openIncidents)

	// Recent incidents across all users (join monitor name)
	type RecentIncident struct {
		ID          uint   `json:"id"`
		MonitorName string `json:"monitor_name"`
		Cause       string `json:"cause"`
		StartTime   string `json:"start_time"`
	}
	var recentIncidents []RecentIncident
	config.DB.Table("incidents").
		Select("incidents.id, monitors.name as monitor_name, COALESCE(incidents.cause,'') as cause, incidents.start_time").
		Joins("LEFT JOIN monitors ON incidents.monitor_id = monitors.id").
		Order("incidents.start_time DESC").
		Limit(10).
		Scan(&recentIncidents)

	return c.JSON(fiber.Map{
		"total_users":      totalUsers,
		"total_monitors":   totalMonitors,
		"up_monitors":      upMonitors,
		"down_monitors":    downMonitors,
		"open_incidents":   openIncidents,
		"recent_incidents": recentIncidents,
	})
}

// ─── USERS ────────────────────────────────────────────────────────────────────

// GET /api/admin/users
func AdminGetUsers(c *fiber.Ctx) error {
	type UserRow struct {
		ID            uint   `json:"id"`
		Email         string `json:"email"`
		FullName      string `json:"full_name"`
		Role          string `json:"role"`
		Plan          string `json:"plan"`
		MonitorCount  int64  `json:"monitor_count"`
		CreatedAt     string `json:"created_at"`
	}

	var users []models.User
	config.DB.Find(&users)

	var rows []UserRow
	for _, u := range users {
		var mc int64
		config.DB.Model(&models.Monitor{}).Where("user_id = ?", u.ID).Count(&mc)
		fn := ""
		if u.FullName != nil {
			fn = *u.FullName
		}
		rows = append(rows, UserRow{
			ID:           u.ID,
			Email:        u.Email,
			FullName:     fn,
			Role:         u.Role,
			Plan:         u.Plan,
			MonitorCount: mc,
			CreatedAt:    u.CreatedAt.Format("02/01/2006"),
		})
	}

	if rows == nil {
		rows = []UserRow{}
	}

	return c.JSON(rows)
}

// PUT /api/admin/users/:id
func AdminUpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct {
		Role string `json:"role"`
		Plan string `json:"plan"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	updates := map[string]interface{}{}
	if body.Role != "" {
		updates["role"] = body.Role
	}
	if body.Plan != "" {
		updates["plan"] = body.Plan
	}

	if err := config.DB.Model(&models.User{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}
	return c.JSON(fiber.Map{"message": "User updated"})
}

// DELETE /api/admin/users/:id
func AdminDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	// Delete cascade: incidents → ping_logs → monitors → user
	config.DB.Exec("DELETE incidents FROM incidents JOIN monitors ON incidents.monitor_id = monitors.id WHERE monitors.user_id = ?", id)
	config.DB.Exec("DELETE ping_logs FROM ping_logs JOIN monitors ON ping_logs.monitor_id = monitors.id WHERE monitors.user_id = ?", id)
	config.DB.Where("user_id = ?", id).Delete(&models.Monitor{})
	if err := config.DB.Where("id = ?", id).Delete(&models.User{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	return c.JSON(fiber.Map{"message": "User deleted"})
}

// ─── MONITORS ────────────────────────────────────────────────────────────────

// GET /api/admin/monitors
func AdminGetMonitors(c *fiber.Ctx) error {
	type MonitorRow struct {
		ID            uint   `json:"id"`
		UserEmail     string `json:"user_email"`
		Name          string `json:"name"`
		Target        string `json:"target"`
		MonitorType   string `json:"monitor_type"`
		Status        string `json:"status"`
		CheckInterval int    `json:"check_interval"`
		CreatedAt     string `json:"created_at"`
	}

	var rows []MonitorRow
	config.DB.Table("monitors").
		Select("monitors.id, users.email as user_email, monitors.name, monitors.target, monitors.monitor_type, monitors.status, monitors.check_interval, monitors.created_at").
		Joins("LEFT JOIN users ON monitors.user_id = users.id").
		Order("monitors.id DESC").
		Scan(&rows)

	if rows == nil {
		rows = []MonitorRow{}
	}
	return c.JSON(rows)
}

// ─── LOCATIONS ────────────────────────────────────────────────────────────────

// GET /api/admin/locations
func AdminGetLocations(c *fiber.Ctx) error {
	var locs []models.Location
	config.DB.Order("id ASC").Find(&locs)
	return c.JSON(locs)
}

// POST /api/admin/locations
func AdminCreateLocation(c *fiber.Ctx) error {
	var loc models.Location
	if err := c.BodyParser(&loc); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Create(&loc).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create location"})
	}
	return c.Status(fiber.StatusCreated).JSON(loc)
}

// PUT /api/admin/locations/:id
func AdminUpdateLocation(c *fiber.Ctx) error {
	id := c.Params("id")
	var body models.Location
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Model(&models.Location{}).Where("id = ?", id).Updates(body).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update location"})
	}
	return c.JSON(fiber.Map{"message": "Location updated"})
}

// DELETE /api/admin/locations/:id
func AdminDeleteLocation(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := config.DB.Where("id = ?", id).Delete(&models.Location{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete location"})
	}
	return c.JSON(fiber.Map{"message": "Location deleted"})
}
