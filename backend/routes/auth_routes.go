package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/phamnguyen2004/updown_app/controllers"
)

func SetupAuthRoutes(app *fiber.App) {
	auth := app.Group("/api/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
}
