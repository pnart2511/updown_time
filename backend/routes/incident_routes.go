package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
	"github.com/phamnguyen2004/updown_app/middleware"
)

func SetupIncidentRoutes(app *fiber.App) {
	api := app.Group("/api/incidents")

	// Protected endpoints
	api.Use(middleware.Protected())

	api.Get("/", controllers.GetIncidents)
}
