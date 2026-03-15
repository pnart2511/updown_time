package models

import (
	"time"
)

type SystemSetting struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Key       string    `gorm:"size:191;uniqueIndex;not null" json:"key"`
	Value     string    `gorm:"type:text" json:"value"`
	Group     string    `gorm:"size:191;index" json:"group"` // smtp, branding, seo, etc.
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
