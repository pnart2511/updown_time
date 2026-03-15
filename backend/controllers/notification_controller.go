package controllers

import (
	"fmt"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

// List Notification Channels
func GetNotificationChannels(c *fiber.Ctx) error {
	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var channels []models.NotificationChannel
	if err := config.DB.Where("user_id = ?", userId).Find(&channels).Error; err != nil {
		log.Println("Error fetching channels:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Không thể lấy danh sách thông báo"})
	}

	return c.Status(fiber.StatusOK).JSON(channels)
}

// Create or update a notification channel
func UpsertNotificationChannel(c *fiber.Ctx) error {
	userId := c.Locals("user_id")
	if userId == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req struct {
		Type            string `json:"type"`
		Target          string `json:"target"`
		BotToken        string `json:"bot_token"`
		MessageTemplate string `json:"message_template"`
		Enabled         bool   `json:"enabled"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Dữ liệu không hợp lệ"})
	}

	if req.Type == "" || req.Target == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Thiếu dữ liệu bắt buộc (type, target)"})
	}

	uidStr := fmt.Sprintf("%v", userId)
	uidInt, err := strconv.Atoi(uidStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is not a number"})
	}
	uid := uint(uidInt)

	// Upsert based on Type (one config per type per user)
	var channel models.NotificationChannel
	err = config.DB.Where("user_id = ? AND type = ?", uid, req.Type).First(&channel).Error

	if err != nil {
		// Does not exist, create
		channel = models.NotificationChannel{
			UserID:          uid,
			Type:            req.Type,
			Target:          req.Target,
			BotToken:        req.BotToken,
			MessageTemplate: req.MessageTemplate,
			Enabled:         req.Enabled,
		}
		if err := config.DB.Create(&channel).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Lỗi database khi tạo!"})
		}
	} else {
		// Exists, update
		channel.Target = req.Target
		channel.BotToken = req.BotToken
		channel.MessageTemplate = req.MessageTemplate
		channel.Enabled = req.Enabled
		if err := config.DB.Save(&channel).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Lỗi database khi cập nhật!"})
		}
	}

	return c.Status(fiber.StatusOK).JSON(channel)
}
