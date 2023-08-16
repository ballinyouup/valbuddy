package db

import (
	"time"
)

type User struct {
	ID        string    `json:"id" gorm:"primaryKey" validate:"required,min=1"`
	Email     string    `json:"email" gorm:"unique" validate:"required,email"`
	Username  string    `json:"username" gorm:"unique" validate:"required,min=1"`
	Role      string    `json:"role" validate:"required,min=1"`
	Image     string    `json:"image_url" validate:"required,min=1"`
	Provider  string    `json:"provider" validate:"required,min=1"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
}

type Account struct {
	ID       string `json:"id" gorm:"primaryKey" validate:"required,min=1"`
	UserID   string `json:"user_id" validate:"required,min=1"`
	Username string `json:"username" validate:"omitempty"`
	Rank     string `json:"rank" validate:"omitempty"`

}

type Post struct {
	ID     string `json:"id" gorm:"primaryKey" validate:"required,min=1"`
	UserID string `json:"user_id" validate:"required,min=1"`
	Text   string `json:"text" validate:"required,min=1"`
}
