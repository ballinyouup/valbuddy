package db

import (
	"time"
)

type User struct {
	UserID    string    `json:"user_id" gorm:"unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Email     string    `json:"email" gorm:"unique"`
	Username  string    `json:"username" gorm:"unique"`
	Role      string    `json:"role"`
	Image     string    `json:"image_url"`
}

