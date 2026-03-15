package models

import "time"

type PingLog struct {
	ID         uint64    `gorm:"primaryKey;autoIncrement" json:"id"`
	MonitorID  uint      `gorm:"not null;index:idx_monitor_time,priority:1;constraint:OnDelete:CASCADE;" json:"monitor_id"`
	LatencyMs  int       `gorm:"not null" json:"latency_ms"`
	StatusCode *int      `json:"status_code"`
	IsSuccess  bool      `json:"is_success"`
	RecordedAt time.Time `gorm:"autoCreateTime;index:idx_monitor_time,priority:2,sort:desc" json:"recorded_at"`
}
