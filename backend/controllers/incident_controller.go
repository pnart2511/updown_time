package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

// GetIncidents godoc
// GET /api/incidents
func GetIncidents(c *fiber.Ctx) error {
	// Lấy user_id từ JWT middleware
	userID := c.Locals("user_id").(uint)

	var incidents []models.Incident

	// Lấy tất cả sự cố thuộc về các monitor do user này sở hữu
	if err := config.DB.Joins("JOIN monitors ON incidents.monitor_id = monitors.id").
		Where("monitors.user_id = ?", userID).
		Order("incidents.start_time DESC").
		Find(&incidents).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch incidents",
		})
	}

	// Format lại dữ liệu cho frontend dễ đọc
	var formattedIncidents []fiber.Map
	for _, inc := range incidents {
		// Tìm tên Monitor
		var m models.Monitor
		config.DB.Select("name").Where("id = ?", inc.MonitorID).First(&m)

		status := "open"
		if inc.EndTime != nil {
			status = "resolved"
		}

		formattedIncidents = append(formattedIncidents, fiber.Map{
			"id":           inc.ID,
			"monitor_name": m.Name,
			"monitor_id":   inc.MonitorID,
			"start_time":   inc.StartTime,
			"end_time":     inc.EndTime,
			"status":       status,
			"cause":        inc.Cause,
		})
	}

	return c.JSON(fiber.Map{
		"incidents": formattedIncidents,
	})
}
