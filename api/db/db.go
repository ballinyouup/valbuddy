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

var validate *validator.Validate
var Database *gorm.DB
var Store fiber.Storage
var Sessions *session.Store

func Init() error {
	validate = validator.New()
	var err error
	Database, err = gorm.Open(postgres.Open(config.Env.DATABASE_URL), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("database init > error initializing database: %w", err)
	}
	Store = pg.New(pg.Config{
		ConnectionURI: config.Env.DATABASE_URL,
		Database:      "postgres",
		Table:         "sessions",
		Reset:         false,
		GCInterval:    10 * time.Second,
	})
	Sessions = session.New(session.Config{
		Storage:        Store,
		Expiration:     24 * time.Hour,
		CookieDomain:   config.Env.COOKIE_DOMAIN,
		CookieSameSite: "None",
		CookieSecure:   true,
		CookiePath:     "/",
	})
	err = Database.AutoMigrate(&User{})
	if err != nil {
		return fmt.Errorf("database init > error during auto migration: %w", err)
	}
	return nil
}


