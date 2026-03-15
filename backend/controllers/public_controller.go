package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

// GetPublicSettings returns non-sensitive system configurations like branding and SEO.
// It explicitly excludes SMTP settings for security.
func GetPublicSettings(c *fiber.Ctx) error {
	var settings []models.SystemSetting
	// Fetch all except smtp group
	if err := config.DB.Where("`group` != ?", "smtp").Find(&settings).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	
	// Create a map for easier frontend consumption
	result := make(map[string]string)
	for _, s := range settings {
		result[s.Key] = s.Value
	}
	
	return c.JSON(result)
}

// GetPublicArticles returns only published articles.
func GetPublicArticles(c *fiber.Ctx) error {
	var articles []models.Article
	if err := config.DB.Where("status = ?", "published").Order("created_at desc").Find(&articles).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(articles)
}

// GetPublicArticleBySlug returns a specific published article by its slug.
func GetPublicArticleBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var article models.Article
	if err := config.DB.Where("slug = ? AND status = ?", slug, "published").First(&article).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Article not found"})
	}
	return c.JSON(article)
}

// GetPublicPlans returns all pricing plans.
func GetPublicPlans(c *fiber.Ctx) error {
	var plans []models.Plan
	if err := config.DB.Order("price asc").Find(&plans).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(plans)
}
