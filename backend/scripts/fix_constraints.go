package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Fixing foreign keys for cascading delete...")

	// 1. Fix ping_logs
	fmt.Println("- Updating ping_logs...")
	db.Exec("ALTER TABLE ping_logs DROP FOREIGN KEY fk_monitors_ping_logs")
	db.Exec("ALTER TABLE ping_logs ADD CONSTRAINT fk_monitors_ping_logs FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE")

	// 2. Fix incidents
	fmt.Println("- Updating incidents...")
	db.Exec("ALTER TABLE incidents DROP FOREIGN KEY fk_monitors_incidents")
	db.Exec("ALTER TABLE incidents ADD CONSTRAINT fk_monitors_incidents FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE")

	// 3. Fix monitor_tags (many-to-many)
	fmt.Println("- Updating monitor_tags...")
	db.Exec("ALTER TABLE monitor_tags DROP FOREIGN KEY fk_monitor_tags_monitor")
	db.Exec("ALTER TABLE monitor_tags ADD CONSTRAINT fk_monitor_tags_monitor FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE")

	fmt.Println("Done!")
}
