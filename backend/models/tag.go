package models

import "time"

type Tag struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Name      string    `gorm:"not null;type:varchar(50)" json:"name"`
	Color     string    `gorm:"type:varchar(20);default:'#3b82f6'" json:"color"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	Monitors  []Monitor `gorm:"many2many:monitor_tags;" json:"monitors,omitempty"`
}
