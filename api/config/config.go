package config

import (
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
	// Add more configuration variables here if needed
}

var Env *Config

// LoadConfig loads the configuration from the .env file
func LoadConfig() (*Config, error) {
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") == "" {
		err := godotenv.Load("../.env")
		if err != nil {
			return nil, err
		}
	}

	var apiURL string
	if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "" {
		apiURL = os.Getenv("API_URL")
	} else {
		apiURL = "http://127.0.0.1:3000"
	}

	// Create a new Config instance and populate it with the environment variables
	Env = &Config{
		DISCORD_ID:     os.Getenv("DISCORD_ID"),
		DISCORD_SECRET: os.Getenv("DISCORD_SECRET"),
		DATABASE_URL:   os.Getenv("DATABASE_URL"),
		API_URL:        apiURL,
		IS_LAMBDA:      os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "",
		// Add more configuration variables here if needed
	}

	return Env, nil
}
