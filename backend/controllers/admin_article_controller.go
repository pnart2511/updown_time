package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"strconv"
)

func GetArticles(c *fiber.Ctx) error {
	var articles []models.Article
	config.DB.Find(&articles)
	return c.JSON(articles)
}

func CreateArticle(c *fiber.Ctx) error {
	article := new(models.Article)
	if err := c.BodyParser(article); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	if err := config.DB.Create(&article).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(article)
}

func UpdateArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	article := new(models.Article)
	if err := c.BodyParser(article); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	if err := config.DB.Model(&models.Article{}).Where("id = ?", id).Updates(article).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(article)
}

func DeleteArticle(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	config.DB.Delete(&models.Article{}, id)
	return c.SendStatus(204)
}
