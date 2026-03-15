package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
	"github.com/phamnguyen2004/updown_app/middleware"
)

func SetupAdminRoutes(app *fiber.App) {
	admin := app.Group("/api/admin")

	// All admin routes require JWT + admin role
	admin.Use(middleware.Protected())
	admin.Use(middleware.AdminOnly())

	// Stats
	admin.Get("/stats", controllers.AdminGetStats)

	// Users
	admin.Get("/users", controllers.AdminGetUsers)
	admin.Put("/users/:id", controllers.AdminUpdateUser)
	admin.Delete("/users/:id", controllers.AdminDeleteUser)

	// Monitors
	admin.Get("/monitors", controllers.AdminGetMonitors)

	// Locations
	admin.Get("/locations", controllers.AdminGetLocations)
	admin.Post("/locations", controllers.AdminCreateLocation)
	admin.Put("/locations/:id", controllers.AdminUpdateLocation)
	admin.Delete("/locations/:id", controllers.AdminDeleteLocation)

	// System Settings
	admin.Get("/settings", controllers.GetSystemSettings)
	admin.Post("/settings", controllers.UpdateSystemSettings)
	admin.Post("/settings/test-email", controllers.SendTestEmail)

	// CMS Articles
	admin.Get("/articles", controllers.GetArticles)
	admin.Post("/articles", controllers.CreateArticle)
	admin.Put("/articles/:id", controllers.UpdateArticle)
	admin.Delete("/articles/:id", controllers.DeleteArticle)

	// Pricing Plans
	admin.Get("/plans", controllers.GetPlans)
	admin.Post("/plans", controllers.CreatePlan)
	admin.Put("/plans/:id", controllers.UpdatePlan)
	admin.Delete("/plans/:id", controllers.DeletePlan)
}
