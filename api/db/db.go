package db

import (
	"fmt"
	"log"
	"strings"
	"sveltekit-go/config"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var validate *validator.Validate
var db *gorm.DB

func Init() error {
	validate = validator.New()
	var err error
	db, err = gorm.Open(postgres.Open(config.Env.DATABASE_URL), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("database init > error initializing database: %w", err)
	}
	err = db.AutoMigrate(&User{})
	if err != nil {
		return fmt.Errorf("database init > error during auto migration: %w", err)
	}
	return nil
}

func CreateUser(c *fiber.Ctx, email string, username string, role string, image string, provider string) error {
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
			return fmt.Errorf("new user failed validation: %s", strings.Join(validationErrors, ", "))
		}
		// Create the user record in the database
		db.Create(newUser)

		timeLayout := "2006-01-02 15:04:05"
		log.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s, provider: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image, newUser.Provider)

		return nil
	}
	return nil
}
