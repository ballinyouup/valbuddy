package db

import (
	"fmt"
	"time"
	"valbuddy/internals/config"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	pg "github.com/gofiber/storage/postgres/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var validate *validator.Validate
var database *gorm.DB
var store fiber.Storage
var sessions *session.Store

// GetValidate returns the validate instance
func GetValidate() *validator.Validate {
	return validate
}

// GetDatabase returns the database instance
func GetDatabase() *gorm.DB {
	return database
}

// GetStore returns the store instance
func GetStore() fiber.Storage {
	return store
}

// GetSessions returns the sessions instance
func GetSessions() *session.Store {
	return sessions
}

// Init initializes various components of the application.
func Init(databaseURL string, logLevel logger.LogLevel) error {
	// Initialize the validator
	validate = validator.New()
	var err error

	// Initialize the database connection using the provided DATABASE_URL
	database, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return fmt.Errorf("error initializing database: %w", err)
	}
	// Initialize the session storage using PostgreSQL as a backend
	store = pg.New(pg.Config{
		ConnectionURI: databaseURL,
		Database:      "postgres",
		Table:         "sessions",
		Reset:         false,
		GCInterval:    10 * time.Second,
	})
	// Initialize session management
	sessions = session.New(session.Config{
		Storage:        store,
		Expiration:     24 * time.Hour,
		CookieDomain:   config.Env.COOKIE_DOMAIN,
		CookieSameSite: "None",
		CookieSecure:   true,
		CookiePath:     "/",
	})
	// Perform automatic database migration for specified models
	err = database.AutoMigrate(&User{}, &Account{}, &Post{})
	if err != nil {
		return fmt.Errorf("error during auto migration: %w", err)
	}

	return nil
}
