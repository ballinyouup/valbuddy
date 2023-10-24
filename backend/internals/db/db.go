package db

import (
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	pg "github.com/gofiber/storage/postgres/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Init initializes various components of the application.
func NewDatabase(databaseURL string, logLevel logger.LogLevel, cookieDomain string) (*validator.Validate, *gorm.DB, fiber.Storage, *session.Store, error) {
	// Initialize the validator
	validate := validator.New()
	var err error

	// Initialize the database connection using the provided DATABASE_URL
	database, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return &validator.Validate{}, &gorm.DB{}, pg.New(pg.Config{}), &session.Store{}, fmt.Errorf("error initializing database: %w", err)
	}
	// Initialize the session storage using PostgreSQL as a backend
	store := pg.New(pg.Config{
		ConnectionURI: databaseURL,
		Database:      "postgres",
		Table:         "sessions",
		Reset:         false,
		GCInterval:    10 * time.Second,
	})
	// Initialize session management
	sessions := session.New(session.Config{
		Storage:        store,
		Expiration:     24 * time.Hour,
		CookieDomain:   cookieDomain,
		CookieSameSite: "None",
		CookieSecure:   true,
		CookiePath:     "/",
	})
	// Perform automatic database migration for specified models
	err = database.AutoMigrate(&User{}, &Account{}, &Post{})
	if err != nil {
		return &validator.Validate{}, &gorm.DB{}, pg.New(pg.Config{}), &session.Store{}, fmt.Errorf("error during auto migration: %w", err)
	}

	return validate, database, store, sessions, nil
}
