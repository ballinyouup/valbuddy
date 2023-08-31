package db

import (
	"time"
)

// Sensitive User Data
type User struct {
	ID        string    `json:"id" gorm:"primaryKey" validate:"required,min=1"`   // User ID
	Email     string    `json:"email" gorm:"unique" validate:"required,email"`    // OAuth Email
	Username  string    `json:"username" gorm:"unique" validate:"required,min=1"` // OAuth Username/VALBuddy Username
	Image     string    `json:"image_url" validate:"required,min=1"`              // OAuth Image
	Provider  string    `json:"provider" validate:"required,min=1"`               // OAuth Provider
	
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// VALBuddy Data
type Account struct {
	ID        string    `json:"id" gorm:"primaryKey" validate:"required,min=1"` // Account ID
	UserID    string    `json:"user_id" validate:"required,min=1"`              // ID from User Model
	Username  string    `json:"username" validate:"omitempty"`                  // VALORANT Username
	Rank      string    `json:"rank" validate:"omitempty"`                      // VALORANT RANK
	Role      string    `json:"role" validate:"required,min=1"`                 // Role FREE or PAID

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

type Post struct {
	ID       string `json:"id" gorm:"primaryKey" validate:"required,min=1"` // Post ID
	UserID   string `json:"user_id" validate:"required,min=1"`              // ID from User Model
	Username string `json:"username" validate:"omitempty"`                  // Username from Account Model

	Text        string    `json:"text" validate:"required,min=1"`                // Post Text
	Players     int       `json:"player_amount" validate:"required,min=0,max=5"` // VALORANT PLAYER #: 0<=x<=5
	PlayerRoles []string  `json:"player_roles" validate:"omitempty"`             // VALORANT ROLES
	PlayerRanks []string  `json:"player_ranks" validate:"omitempty"`             // VALORANT RANK/RANGE FILTER
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
