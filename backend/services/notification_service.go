package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/phamnguyen2004/updown_app/config"
	"github.com/phamnguyen2004/updown_app/models"
)

// TriggerNotification checks for enabled channels for a user and sends alerts
func TriggerNotification(userID uint, monitor models.Monitor, newStatus string, latency int, statusCode *int, errorMsg string) {
	var channels []models.NotificationChannel
	if err := config.DB.Where("user_id = ? AND enabled = ?", userID, true).Find(&channels).Error; err != nil {
		log.Printf("❌ Pinger: Error fetching notification channels for user %d: %v", userID, err)
		return
	}

	for _, ch := range channels {
		switch ch.Type {
		case "TELEGRAM":
			if ch.BotToken != "" && ch.Target != "" {
				sendTelegramAlert(ch, monitor, newStatus, latency, statusCode, errorMsg)
			}
		case "EMAIL":
			// Placeholder for Email notification logic
			log.Printf("📧 Email Alert (Simulated) to %s: Monitor %s is %s", ch.Target, monitor.Name, newStatus)
		}
	}
}

func sendTelegramAlert(ch models.NotificationChannel, m models.Monitor, status string, latency int, statusCode *int, errorMsg string) {
	// Parse template
	template := ch.MessageTemplate
	if template == "" {
		template = "⚠️ Website {domain} is {status}!"
	}

	codeStr := errorMsg
	if statusCode != nil {
		codeStr = fmt.Sprintf("%d", *statusCode)
	}
	
	if status == "UP" && (codeStr == "" || statusCode != nil && *statusCode == 200) {
		codeStr = "200 (OK)"
	}

	if codeStr == "" {
		codeStr = "N/A"
	}

	// Dynamic variables
	replacer := strings.NewReplacer(
		"{name}", m.Name,
		"{domain}", m.Target,
		"{status}", status,
		"{time}", time.Now().Format("15:04:05 02/01/2006"),
		"{response_time}", fmt.Sprintf("%dms", latency),
		"{status_code}", codeStr,
	)
	message := replacer.Replace(template)

	// Telegram API call
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", ch.BotToken)
	payload := map[string]string{
		"chat_id":    ch.Target,
		"text":       message,
		"parse_mode": "HTML",
	}

	jsonPayload, _ := json.Marshal(payload)
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		log.Printf("❌ Telegram API Error: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("⚠️ Telegram API returned status: %d", resp.StatusCode)
	} else {
		log.Printf("✅ Telegram alert sent successfully to %s for monitor %s", ch.Target, m.Name)
	}
}
