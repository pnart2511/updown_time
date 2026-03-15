package models

import (
	"time"
)

type Plan struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Name            string    `gorm:"not null" json:"name"`
	Price           float64   `json:"price"`
	Currency        string    `gorm:"default:'USD'" json:"currency"`
	Interval        string    `gorm:"default:'monthly'" json:"interval"` // monthly, yearly
	Features        string    `gorm:"type:text" json:"features"`          // display text (comma separated)
	MaxMonitors     int       `json:"max_monitors"`
	CheckInterval   int       `gorm:"default:300" json:"check_interval"`    // min check interval in seconds (e.g. 300 = 5 min)
	MaxStatusPages  int       `gorm:"default:1" json:"max_status_pages"`    // max public status pages
	AllowedChannels string    `gorm:"default:'email'" json:"allowed_channels"` // comma-sep: email,telegram,slack
	IsDefault       bool      `gorm:"default:false" json:"is_default"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
