package db

import (
	"fmt"
	"nextjs-go/config"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	pg "github.com/gofiber/storage/postgres/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Validate *validator.Validate
var Database *gorm.DB
var Store fiber.Storage
var Sessions *session.Store

// Init initializes various components of the application.
func Init() error {
	// Initialize the validator
	Validate = validator.New()
	var err error
	
	// Initialize the database connection using the provided DATABASE_URL
	Database, err = gorm.Open(postgres.Open(config.Env.DATABASE_URL), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error initializing database: %w", err)
	}

	// Initialize the session storage using PostgreSQL as a backend
	Store = pg.New(pg.Config{
		ConnectionURI: config.Env.DATABASE_URL,
		Database:      "postgres",
		Table:         "sessions",
		Reset:         false,
		GCInterval:    10 * time.Second,
	})

	// Initialize session management
	Sessions = session.New(session.Config{
		Storage:        Store,
		Expiration:     24 * time.Hour,
		CookieDomain:   config.Env.COOKIE_DOMAIN,
		CookieSameSite: "None",
		CookieSecure:   true,
		CookiePath:     "/",
	})

	// Perform automatic database migration for specified models
	err = Database.AutoMigrate(&User{}, &Account{}, &Post{})
	if err != nil {
		return fmt.Errorf("error during auto migration: %w", err)
	}

	return nil
}

