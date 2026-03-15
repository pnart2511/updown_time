package services

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// StartPinger initializes the background monitoring loop
func StartPinger() {
	log.Println("🚀 Background Pinger Service started...")
	
	// Check every 10 seconds for real-time feel in the dashboard
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		var monitors []models.Monitor
		// Fetch only active (non-paused) monitors
		if err := config.DB.Where("status != ?", "PAUSED").Find(&monitors).Error; err != nil {
			log.Println("❌ Pinger: Error fetching monitors:", err)
			continue
		}

		for _, m := range monitors {
			// Run each ping in a concurrent goroutine
			go pingMonitor(m)
		}
	}
}

func pingMonitor(m models.Monitor) {
	var latency int
	var statusCode *int
	var finalStatus string

	// Use the timeout configured in the monitor
	timeout := m.Timeout
	if timeout <= 0 {
		timeout = 30
	}

	var errorMsg string
	switch m.MonitorType {
	case "PING":
		latency, finalStatus, errorMsg = pingICMP(m.Target, timeout)
	case "MYSQL":
		latency, finalStatus, errorMsg = pingMySQL(m.Target, m.DBQuery, timeout)
	default: // Default to HTTP
		acceptedCodes := "200-299"
		if m.HTTPAcceptedCodes != nil && *m.HTTPAcceptedCodes != "" {
			acceptedCodes = *m.HTTPAcceptedCodes
		}
		latency, statusCode, finalStatus, errorMsg = pingHTTP(m.Target, timeout, acceptedCodes)
	}

	// 1. Create Ping Log
	pingLog := models.PingLog{
		MonitorID:  m.ID,
		LatencyMs:  latency,
		StatusCode: statusCode,
		IsSuccess:  finalStatus == "UP",
		RecordedAt: time.Now(),
	}
	if err := config.DB.Create(&pingLog).Error; err != nil {
		log.Println("❌ Failed to save ping log:", err)
	}

	// 2. Notification Logic
	shouldUpdateNotifiedAt := false
	if m.Status != finalStatus {
		log.Printf("🔔 Status Change detected for %s: %s -> %s", m.Name, m.Status, finalStatus)
		TriggerNotification(m.UserID, m, finalStatus, latency, statusCode, errorMsg)
		shouldUpdateNotifiedAt = true
	} else if finalStatus == "DOWN" && m.ResendInterval > 0 {
		lastNotified := m.LastNotifiedAt
		if lastNotified == nil {
			lastNotified = &m.CreatedAt
		}
		if time.Since(*lastNotified).Minutes() >= float64(m.ResendInterval) {
			log.Printf("🔔 Resending DOWN notification for %s (Interval: %d min)", m.Name, m.ResendInterval)
			TriggerNotification(m.UserID, m, finalStatus, latency, statusCode, errorMsg)
			shouldUpdateNotifiedAt = true
		}
	}

	// 3. Update Monitor Metadata
	now := time.Now()
	updates := map[string]interface{}{
		"status":          finalStatus,
		"last_checked_at": &now,
	}
	if shouldUpdateNotifiedAt {
		updates["last_notified_at"] = &now
	}

	if err := config.DB.Model(&m).Updates(updates).Error; err != nil {
		log.Println("❌ Failed to update monitor metadata:", err)
	}
}

func pingHTTP(target string, timeout int, acceptedCodes string) (int, *int, string, string) {
	start := time.Now()
	client := http.Client{
		Timeout: time.Duration(timeout) * time.Second,
	}

	resp, err := client.Get(target)
	latency := int(time.Since(start).Milliseconds())

	if err != nil {
		log.Printf("⚠️ HTTP Ping Error [%s]: %v", target, err)
		return latency, nil, "DOWN", err.Error()
	}
	defer resp.Body.Close()

	code := resp.StatusCode
	finalStatus := "DOWN"
	errorMsg := ""

	if isCodeAccepted(code, acceptedCodes) {
		finalStatus = "UP"
	} else {
		errorMsg = fmt.Sprintf("HTTP %d (not in %s)", code, acceptedCodes)
	}

	return latency, &code, finalStatus, errorMsg
}

func isCodeAccepted(code int, acceptedStr string) bool {
	// Simple validation: if empty, default to 200-299
	if acceptedStr == "" {
		return code >= 200 && code < 300
	}

	parts := strings.Split(acceptedStr, ",")
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if strings.Contains(p, "-") {
			rangeParts := strings.Split(p, "-")
			if len(rangeParts) == 2 {
				min, _ := strconv.Atoi(strings.TrimSpace(rangeParts[0]))
				max, _ := strconv.Atoi(strings.TrimSpace(rangeParts[1]))
				if code >= min && code <= max {
					return true
				}
			}
		} else {
			val, _ := strconv.Atoi(p)
			if code == val {
				return true
			}
		}
	}
	return false
}

func pingICMP(target string, timeout int) (int, string, string) {
	start := time.Now()
	// Using system ping command for broad compatibility. 
	// -c 1: send 1 packet. -W timeout: timeout in seconds.
	cmd := exec.Command("ping", "-c", "1", "-W", strconv.Itoa(timeout), target)
	output, err := cmd.CombinedOutput()
	latency := int(time.Since(start).Milliseconds())

	if err != nil {
		log.Printf("⚠️ ICMP Ping Error [%s]: %v", target, err)
		return latency, "DOWN", err.Error()
	}

	// Try to parse actual latency from output if possible (optional refinement)
	// Example: 64 bytes from ... time=14.2 ms
	re := regexp.MustCompile(`time=([0-9.]+)`)
	matches := re.FindStringSubmatch(string(output))
	if len(matches) > 1 {
		if val, err := strconv.ParseFloat(matches[1], 64); err == nil {
			latency = int(val)
		}
	}

	return latency, "UP", ""
}

func pingMySQL(dsn string, query *string, timeout int) (int, string, string) {
	start := time.Now()

	// Ensure the DSN is formatted correctly for GORM/MySQL driver
	// If it doesn't contain @, it's likely just a host, so we skip or try default
	if !strings.Contains(dsn, "@") {
		log.Printf("⚠️ MYSQL Ping Error [%s]: Invalid DSN format", dsn)
		return 0, "DOWN", "Invalid DSN format"
	}

	// Open temporary connection
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("⚠️ MYSQL Conn Error [%s]: %v", dsn, err)
		return 0, "DOWN", err.Error()
	}

	sqlDB, err := db.DB()
	if err != nil {
		return 0, "DOWN", err.Error()
	}
	defer sqlDB.Close()

	// Set timeout
	sqlDB.SetConnMaxLifetime(time.Duration(timeout) * time.Second)

	// Ping the DB
	if err := sqlDB.Ping(); err != nil {
		log.Printf("⚠️ MYSQL Ping Error [%s]: %v", dsn, err)
		return int(time.Since(start).Milliseconds()), "DOWN", err.Error()
	}

	// Execute query if provided
	if query != nil && *query != "" {
		if err := db.Exec(*query).Error; err != nil {
			log.Printf("⚠️ MYSQL Query Error [%s]: %v", dsn, err)
			return int(time.Since(start).Milliseconds()), "DOWN", err.Error()
		}
	}

	latency := int(time.Since(start).Milliseconds())
	return latency, "UP", ""
}
