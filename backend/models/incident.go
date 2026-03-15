package models

import "time"

type Incident struct {
	ID           uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	MonitorID    uint       `gorm:"not null;constraint:OnDelete:CASCADE;" json:"monitor_id"`
	StartTime    time.Time  `gorm:"not null" json:"start_time"`
	EndTime      *time.Time `json:"end_time"`
	Cause        *string    `gorm:"type:varchar(255)" json:"cause"`
}
