package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Email        string    `gorm:"unique;not null;type:varchar(100)" json:"email"`
	PasswordHash string    `gorm:"not null;type:varchar(255)" json:"-"`
	FullName     *string   `gorm:"type:varchar(100)" json:"full_name"`
	Role         string    `gorm:"type:varchar(20);default:'user'" json:"role"`   // "user" | "admin"
	Plan         string    `gorm:"type:varchar(100);default:'Cơ Bản'" json:"plan"` // Plan name — matches Plan.Name in plans table

	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt            time.Time             `gorm:"autoUpdateTime" json:"updated_at"`
	Monitors             []Monitor             `gorm:"foreignKey:UserID" json:"monitors,omitempty"`
	NotificationChannels []NotificationChannel `gorm:"foreignKey:UserID" json:"notification_channels,omitempty"`
}

