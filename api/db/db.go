package db

import (
	"fmt"
	"log"
	"strings"
	"sveltekit-go/config"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	pg "github.com/gofiber/storage/postgres/v2"
	"github.com/lucsky/cuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var validate *validator.Validate
var db *gorm.DB
var Store fiber.Storage
var Sessions *session.Store

func Init() error {
	validate = validator.New()
	var err error
	db, err = gorm.Open(postgres.Open(config.Env.DATABASE_URL), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("database init > error initializing database: %w", err)
	}
	Store = pg.New(pg.Config{
		ConnectionURI: config.Env.DATABASE_URL,
		Database:      db.Name(),
		Table:         "sessions",
		Reset:         false,
		GCInterval:    10 * time.Second,
	})
	Sessions = session.New(session.Config{
		Storage:        Store,
		Expiration:     5 * time.Minute,
		KeyLookup:      "cookie:auth_session",
		CookieDomain:   config.Env.COOKIE_DOMAIN,
		CookieSameSite: "None",
		CookieSecure:   true,
		CookiePath:     "/",
	})
	err = db.AutoMigrate(&User{})
	if err != nil {
		return fmt.Errorf("database init > error during auto migration: %w", err)
	}
	return nil
}

func CreateOrLoginUser(c *fiber.Ctx, email string, username string, role string, image string, provider string) (User, error) {
	// Check if the user already exists in the database
	existingUser := User{}
	db.Find(&existingUser, "email = ?", email)
	if existingUser.UserID == "" {
		// User does not exist, proceed with user creation
		newUser := &User{
			UserID:   cuid.New(),
			Email:    email,
			Username: username,
			Role:     role,
			Image:    image,
			Provider: provider,
		}
		err := validate.Struct(newUser)
		if err != nil {
			var validationErrors []string
			for _, err := range err.(validator.ValidationErrors) {
				validationErrors = append(validationErrors, fmt.Sprintf("%s validation failed for field %s", err.Tag(), err.Field()))
			}
			return User{}, fmt.Errorf("new user failed validation: %s", strings.Join(validationErrors, ", "))
		}
		// Create the user record in the database
		db.Create(newUser)

		timeLayout := "2006-01-02 15:04:05"
		log.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s, provider: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image, newUser.Provider)

		return *newUser, nil
	}
	return existingUser, nil
}
