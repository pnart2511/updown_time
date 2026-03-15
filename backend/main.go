package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"github.com/phamnguyen2004/updown_app/routes"
	"github.com/phamnguyen2004/updown_app/services"
)

func main() {
	// Kết nối Database
	config.ConnectDB()

	// Start Background Pinger
	go services.StartPinger()

	// Auto-migrate tables
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.MonitorGroup{},
		&models.Tag{},
		&models.Monitor{},
		&models.PingLog{},
		&models.Incident{},
		&models.Location{},
		&models.NotificationChannel{},
		&models.SystemSetting{},
		&models.Article{},
		&models.Plan{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Database migration completed successfully.")

	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Website Monitoring API is running!")
	})

	// Public routes
	routes.SetupPublicRoutes(app)
	// Auth routes
	routes.SetupAuthRoutes(app)
	// Dashboard routes
	routes.SetupDashboardRoutes(app)
	// Monitor CRUD routes
	routes.SetupMonitorRoutes(app)
	// Incidents routes
	routes.SetupIncidentRoutes(app)
	// Admin routes
	routes.SetupAdminRoutes(app)
	// Notification routes
	routes.SetupNotificationRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
