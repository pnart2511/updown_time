package main

import (
	"log"
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
		log.Fatal("No monitors found. Create one first.")
	}

	log.Println("Seeding fake incidents for monitors...")
	causes := []string{"Connection Timeout", "HTTP 500 Internal Server Error", "HTTP 502 Bad Gateway", "DNS Resolution Failed"}

	for i, monitor := range monitors {
		// Create 2-3 incidents per monitor
		for j := 0; j < 2+(i%2); j++ {
			pastHours := time.Duration((j+1)*24) * time.Hour
			startTime := time.Now().Add(-pastHours)
			endTime := startTime.Add(time.Duration(15+j*10) * time.Minute)

			cause := causes[(i+j)%len(causes)]

			incident := models.Incident{
				MonitorID: monitor.ID,
				StartTime: startTime,
				EndTime:   &endTime, // mostly resolved
				Cause:     &cause,
			}

			// Keep 1 open incident for testing if it's the first loop iteration for monitor 1
			if i == 0 && j == 0 {
				incident.EndTime = nil
				incident.StartTime = time.Now().Add(-2 * time.Hour)
			}

			if err := config.DB.Create(&incident).Error; err != nil {
				log.Printf("Error creating incident: %v", err)
			}
		}
	}

	log.Println("Seeding incidents complete!")
}
