package main

import (
	"log"

	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"golang.org/x/crypto/bcrypt"
)

// Run: go run seed_admin.go
// Sets role="admin" on the first user and seeds default locations
func main() {
	config.ConnectDB()

	// ── 1. Set admin role on first user ──────────────────────────────────────
	var firstUser models.User
	if err := config.DB.Order("id ASC").First(&firstUser).Error; err != nil {
		log.Println("No users found. Creating default admin user...")
		hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 10)
		fullName := "Super Admin"
		firstUser = models.User{
			Email:        "admin@upmonitor.vn",
			PasswordHash: string(hash),
			FullName:     &fullName,
			Role:         "admin",
			Plan:         "enterprise",
		}
		config.DB.Create(&firstUser)
	} else {
		config.DB.Model(&firstUser).Updates(map[string]interface{}{
			"role": "admin",
			"plan": "enterprise",
		})
		log.Printf("✅ Set user '%s' (ID=%d) as admin\n", firstUser.Email, firstUser.ID)
	}

	// ── 2. Seed default locations ─────────────────────────────────────────────
	locations := []models.Location{
		{Name: "Hà Nội", Code: "hanoi", Flag: "🇻🇳", Region: "Asia", IsActive: true},
		{Name: "TP. Hồ Chí Minh", Code: "hcm", Flag: "🇻🇳", Region: "Asia", IsActive: true},
		{Name: "Singapore", Code: "sgp", Flag: "🇸🇬", Region: "Asia", IsActive: true},
		{Name: "Tokyo", Code: "tyo", Flag: "🇯🇵", Region: "Asia", IsActive: true},
		{Name: "Frankfurt", Code: "fra", Flag: "🇩🇪", Region: "EU", IsActive: true},
		{Name: "US East (N. Virginia)", Code: "us-east", Flag: "🇺🇸", Region: "US", IsActive: true},
		{Name: "US West (Oregon)", Code: "us-west", Flag: "🇺🇸", Region: "US", IsActive: false},
		{Name: "Sydney", Code: "syd", Flag: "🇦🇺", Region: "Oceania", IsActive: false},
	}

	for _, loc := range locations {
		var existing models.Location
		if config.DB.Where("code = ?", loc.Code).First(&existing).Error != nil {
			config.DB.Create(&loc)
			log.Printf("Created location: %s %s\n", loc.Flag, loc.Name)
		} else {
			log.Printf("Location already exists: %s\n", loc.Name)
		}
	}

	log.Println("✅ Seed admin complete!")
}
