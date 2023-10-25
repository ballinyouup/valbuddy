package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"gorm.io/gorm"
)

func NewApp(validator *validator.Validate, database *gorm.DB, store fiber.Storage, sessions *session.Store, env *Config, AWS *AWS) *App {
	return &App{
		Validate: validator,
		Database: database,
		Store:    store,
		Sessions: sessions,
		Env:      env,
		AWS:      AWS,
	}
}

// LoadConfig loads the configuration from the .env file or environment variables.
func LoadConfig(path string) (*Config, error) {
	// Check if running on AWS Lambda, load from environment variables accordingly
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") == "" {
		// Load environment variables from .env file
		err := godotenv.Load(path)
		if err != nil {
			return nil, fmt.Errorf("error loading config: %w", err)
		}
	}

	// Determine appropriate API and frontend URLs based on Lambda status
	var apiURL string
	var frontendURL string
	var cookieDomain string
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "" {
		apiURL = os.Getenv("API_URL")
		frontendURL = os.Getenv("FRONTEND_URL")
		cookieDomain = os.Getenv("COOKIE_DOMAIN")
	} else {
		// Use default URLs for local development
		apiURL = "http://localhost:3000/api"
		frontendURL = "http://localhost:3000"
		cookieDomain = "localhost"
	}
	
	// Create a new Config instance and populate it with the environment variables
	Env := &Config{
		DISCORD_ID:     os.Getenv("DISCORD_ID"),
		DISCORD_SECRET: os.Getenv("DISCORD_SECRET"),
		TWITCH_ID:      os.Getenv("TWITCH_ID"),
		TWITCH_SECRET:  os.Getenv("TWITCH_SECRET"),

		DATABASE_URL:  os.Getenv("DATABASE_URL"),
		API_URL:       apiURL,
		FRONTEND_URL:  frontendURL,
		COOKIE_DOMAIN: cookieDomain,
		IS_LAMBDA:     os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "",
		TEST_DB:       os.Getenv("TEST_DB"),
		// Add more configuration variables here if needed
	}
	return Env, nil
}

