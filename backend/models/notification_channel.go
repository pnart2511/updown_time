package models

import "time"

type NotificationChannel struct {
	ID              uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID          uint      `gorm:"not null;index" json:"user_id"`
	Type            string    `gorm:"type:varchar(20);not null" json:"type"`              // "EMAIL", "TELEGRAM"
	Target          string    `gorm:"type:varchar(255);not null" json:"target"`           // Email address or Telegram Chat ID
	BotToken        string    `gorm:"type:varchar(255)" json:"bot_token"`                 // Telegram Bot Token
	MessageTemplate string    `gorm:"type:text" json:"message_template"`                  // Custom message template with placeholders
	Enabled         bool      `gorm:"default:true" json:"enabled"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
