package models

import "time"

// Location đại diện cho một vùng địa lý mà hệ thống có thể ping từ đó
type Location struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"not null;type:varchar(100)" json:"name"`     // "Hà Nội", "TP.HCM"
	Code      string    `gorm:"unique;not null;type:varchar(30)" json:"code"` // "hanoi", "hcm"
	Flag      string    `gorm:"type:varchar(10)" json:"flag"`               // "🇻🇳"
	Region    string    `gorm:"type:varchar(50)" json:"region"`             // "Asia", "EU", "US"
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
