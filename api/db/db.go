package db

import (
	"fmt"
	"log"
	"sveltekit-go/config"

	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	db, err := gorm.Open(postgres.Open(config.Env.DATABASE_URL), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	db.AutoMigrate(&User{})

	return db
}

func CreateUser(c *fiber.Ctx, email string, username string, role string, image string, provider string) (User, error) {
	db := Init()

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

		// Create the user record in the database
		db.Create(newUser)
		fmt.Printf("New User Created\n")

		timeLayout := "2006-01-02 15:04:05"
		fmt.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s, provider: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image, newUser.Provider)

		// Return the newly created user in the JSON response
		return *newUser, nil
	}

	return User{}, fiber.NewError(401, "User Already Exists!")
}
