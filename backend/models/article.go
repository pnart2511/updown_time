package models

import (
	"time"
)

type Article struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Slug        string    `gorm:"size:191;uniqueIndex;not null" json:"slug"`
	Content     string    `gorm:"type:longtext" json:"content"`
	Summary     string    `gorm:"type:text" json:"summary"`
	Thumbnail   string    `json:"thumbnail_url"`
	Author      string    `json:"author"`
	Status      string    `gorm:"default:'draft'" json:"status"` // draft, published
	SEOTitle    string    `json:"seo_title"`
	SEOKeywords string    `json:"seo_keywords"`
	SEODesc     string    `json:"seo_description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
