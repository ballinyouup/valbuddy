package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"gorm.io/gorm"
)

// Config represents the configuration for your application.
type Config struct {
	DISCORD_ID     string
	DISCORD_SECRET string
	DATABASE_URL   string
	API_URL        string
	IS_LAMBDA      bool
	FRONTEND_URL   string
	COOKIE_DOMAIN  string
	TWITCH_ID      string
	TWITCH_SECRET  string
	TEST_DB        string
	// Add more configuration variables here if needed
}

type App struct {
	App      *fiber.App
	Validate *validator.Validate
	Database *gorm.DB
	Store    fiber.Storage
	Sessions *session.Store
	Env      *Config
	AWS      *AWS
}
