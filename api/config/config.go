package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config represents the configuration for your application
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
	// Add more configuration variables here if needed
}

var Env *Config

// LoadConfig loads the configuration from the .env file
func LoadConfig() (*Config, error) {
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") == "" {
		err := godotenv.Load("../.env")
		if err != nil {
			return nil, fmt.Errorf("LoadConfig > Error Loading Config: %w", err)
		}
	}

	var apiURL string
	var frontendURL string
	var cookieDomain string
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "" {
		apiURL = os.Getenv("API_URL")
		frontendURL = os.Getenv("FRONTEND_URL")
		cookieDomain = os.Getenv("COOKIE_DOMAIN")
	} else {
		apiURL = "http://localhost:3000/api"
		frontendURL = "http://localhost:3000"
		cookieDomain = "localhost"
	}

	// Create a new Config instance and populate it with the environment variables
	Env = &Config{
		DISCORD_ID:     os.Getenv("DISCORD_ID"),
		DISCORD_SECRET: os.Getenv("DISCORD_SECRET"),
		TWITCH_ID:      os.Getenv("TWITCH_ID"),
		TWITCH_SECRET:  os.Getenv("TWITCH_SECRET"),

		DATABASE_URL:  os.Getenv("DATABASE_URL"),
		API_URL:       apiURL,
		FRONTEND_URL:  frontendURL,
		COOKIE_DOMAIN: cookieDomain,
		IS_LAMBDA:     os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "",
		// Add more configuration variables here if needed
	}

	return Env, nil
}
