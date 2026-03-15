package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
	"github.com/phamnguyen2004/updown_app/middleware"
)

func SetupMonitorRoutes(app *fiber.App) {
	api := app.Group("/api/monitors", middleware.Protected())

	api.Get("/", controllers.GetMonitors)
	api.Post("/", controllers.CreateMonitor)
	api.Get("/:id", controllers.GetMonitorByID)
	api.Get("/:id/logs", controllers.GetMonitorLogs)
	api.Put("/:id", controllers.UpdateMonitor)
	api.Delete("/:id", controllers.DeleteMonitor)

	// Public locations endpoint (for Workflow Builder, all authenticated users)
	app.Get("/api/locations", middleware.Protected(), controllers.GetActiveLocations)
}

