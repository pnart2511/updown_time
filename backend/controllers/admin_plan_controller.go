package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"strconv"
)

// GetPlans - admin endpoint, lists all plans
func GetPlans(c *fiber.Ctx) error {
	var plans []models.Plan
	config.DB.Order("price ASC").Find(&plans)
	return c.JSON(plans)
}

func CreatePlan(c *fiber.Ctx) error {
	plan := new(models.Plan)
	if err := c.BodyParser(plan); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	if err := config.DB.Create(&plan).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(plan)
}

func UpdatePlan(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID"})
	}

	var plan models.Plan
	if err := config.DB.First(&plan, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Plan not found"})
	}

	if err := c.BodyParser(&plan); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	// Use Save (not Updates) so zero-value fields like price=0 are persisted
	if err := config.DB.Save(&plan).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(plan)
}

func DeletePlan(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	config.DB.Delete(&models.Plan{}, id)
	return c.SendStatus(204)
}
