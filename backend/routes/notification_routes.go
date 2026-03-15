package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
	"github.com/phamnguyen2004/updown_app/middleware"
)

func SetupNotificationRoutes(app *fiber.App) {
	api := app.Group("/api/notifications")
	
	// Protected block
	api.Use(middleware.Protected())

	api.Get("/", controllers.GetNotificationChannels)
	api.Put("/", controllers.UpsertNotificationChannel)
}
