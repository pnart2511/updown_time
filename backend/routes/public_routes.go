package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
)

func SetupPublicRoutes(app *fiber.App) {
	public := app.Group("/api/public")

	// Global Settings (SEO, Branding)
	public.Get("/settings", controllers.GetPublicSettings)

	// CMS Articles
	public.Get("/articles", controllers.GetPublicArticles)
	public.Get("/articles/:slug", controllers.GetPublicArticleBySlug)

	// Pricing Plans
	public.Get("/plans", controllers.GetPublicPlans)
}
