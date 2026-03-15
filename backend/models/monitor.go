package models

import "time"

type Monitor struct {
	ID             uint          `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID         uint          `gorm:"not null" json:"user_id"`
	GroupID        *uint         `json:"group_id"` // Khóa ngoại tới MonitorGroup
	Name           string        `gorm:"not null;type:varchar(100)" json:"name"`
	MonitorType    string        `gorm:"not null;type:varchar(20);default:'HTTP'" json:"monitor_type"` // HTTP, PING, MYSQL
	Target         string        `gorm:"not null;type:varchar(500)" json:"target"` // URL, IP/Hostname, or DB String
	
	// Cấu hình vòng lặp & timeout
	CheckInterval  int           `gorm:"default:60" json:"check_interval"` // Tần suất kiểm tra (giây)
	Timeout        int           `gorm:"default:30" json:"timeout"` // Timeout chờ phản hồi (giây)
	
	// Cấu hình cảnh báo retry nâng cao
	MaxRetries     int           `gorm:"default:0" json:"max_retries"` // Thử lại bao nhiêu lần thì báo DOWN
	ResendInterval int           `gorm:"default:0" json:"resend_interval"` // Gửi lại thông báo nếu DOWN (phút. 0 = không gửi lại)
	
	// Config riêng cho HTTP
	HTTPMethod         *string   `gorm:"type:varchar(10);default:'GET'" json:"http_method"`
	HTTPAcceptedCodes  *string   `gorm:"type:varchar(255);default:'200-299'" json:"http_accepted_codes"` // vd: 200-299, 401
	
	// Config riêng cho Database (MySQL/MariaDB/Postgres)
	DBQuery            *string   `gorm:"type:text" json:"db_query"` // vd: SELECT * FROM khach_hang
	
	// System runtime
	Status         string        `gorm:"default:'UP';type:enum('UP','DOWN','PAUSED')" json:"status"`
	LastCheckedAt  *time.Time    `json:"last_checked_at"`
	LastNotifiedAt *time.Time    `json:"last_notified_at"`
	CreatedAt      time.Time     `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time     `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	Tags           []Tag         `gorm:"many2many:monitor_tags;" json:"tags,omitempty"`
	PingLogs       []PingLog     `gorm:"foreignKey:MonitorID" json:"ping_logs,omitempty"`
	Incidents      []Incident    `gorm:"foreignKey:MonitorID" json:"incidents,omitempty"`
}
