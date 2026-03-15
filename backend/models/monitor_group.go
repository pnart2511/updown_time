package models

import "time"

type MonitorGroup struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Name      string    `gorm:"not null;type:varchar(100)" json:"name"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	Monitors  []Monitor `gorm:"foreignKey:GroupID" json:"monitors,omitempty"`
}
