package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
	"github.com/phamnguyen2004/updown_app/middleware"
)

func SetupDashboardRoutes(app *fiber.App) {
	// Group bảo vệ bằng JWT middleware
	api := app.Group("/api/dashboard", middleware.Protected())
	
	api.Get("/", controllers.GetDashboardData)
	api.Get("/profile", controllers.GetProfile)
	api.Put("/profile/password", controllers.ChangePassword)
	api.Post("/upgrade-plan", controllers.UpgradePlan)
}

