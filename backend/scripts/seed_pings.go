package main

import (
	"log"
	"math/rand"
	"time"

	"github.com/joho/godotenv"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found or error loading it")
	}

	config.ConnectDB()

	var monitors []models.Monitor
	if err := config.DB.Find(&monitors).Error; err != nil {
		log.Fatal("Error fetching monitors")
	}

	if len(monitors) == 0 {
		log.Fatal("Run this when you have at least 1 monitor")
	}

	for _, monitor := range monitors {
		log.Println("Seeding 40 ping logs for monitor:", monitor.Name)

		now := time.Now()
		for i := 40; i > 0; i-- {
			code200 := 200
			ping := models.PingLog{
				MonitorID:      monitor.ID,
				StatusCode:     &code200,
				LatencyMs:      100 + rand.Intn(500),
				IsSuccess:      true,
				RecordedAt:     now.Add(time.Duration(-i) * time.Minute),
			}
			// random drop
			if rand.Float32() < 0.05 {
				code500 := 500
				ping.StatusCode = &code500
				ping.LatencyMs = 3000
				ping.IsSuccess = false
			}
			config.DB.Create(&ping)
		}
	}

	log.Println("Done seeding for all monitors!")
}
