package db

import (
	"time"
)

// Sensitive User Data
type User struct {
	ID string `json:"id" gorm:"primaryKey" validate:"required,min=1"` // User ID

	Email    string `json:"email" gorm:"unique" validate:"required,email"`    // OAuth Email
	Username string `json:"username" gorm:"unique" validate:"required,min=1"` // OAuth Username/VALBuddy Username
	Image    string `json:"image_url" validate:"required,min=1"`              // OAuth Image
	Provider string `json:"provider" validate:"required,min=1"`               // OAuth Provider

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// VALBuddy Data
type Account struct {
	ID     string `json:"id" gorm:"primaryKey" validate:"required,min=1"` // Account ID
	UserID string `json:"user_id" validate:"required,min=1"`              // ID from User Model

	Username string `json:"username" validate:"omitempty"` // VALBuddy Username
	Rank     string `json:"rank" validate:"omitempty"`     // VALORANT RANK
	Role     string `json:"role" validate:"required"`      // Role FREE/PAID/MOD/ADMIN
	Region   string `json:"region" validate:"omitempty"`    // NA/EU etc...

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

type Post struct {
	ID       string `json:"id" gorm:"primaryKey" validate:"required,min=1"` // Post ID
	UserID   string `json:"user_id" validate:"required,min=1"`              // ID from User Model
	Username string `json:"username" validate:"omitempty"`                  // VALORANT Username
	Image    string `json:"image_url" validate:"required,min=1"`            // Image from User Model

	Region      string `json:"region" validate:"required"`                    // NA/EU etc...
	Category    string `json:"category" validate:"required,min=1"`            // Category: Duos, Team, etc.
	Text        string `json:"text" gorm:"text" validate:"required,min=1"`    // Post Text
	Players     int    `json:"player_amount" validate:"required,min=1,max=5"` // VALORANT PLAYER #: 1<=x<=5
	PlayerRoles []byte `json:"player_roles" gorm:"type:json"`                 // VALORANT ROLES
	PlayerRanks []byte `json:"player_ranks" gorm:"type:json"`                 // VALORANT RANK/RANGE FILTER

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
