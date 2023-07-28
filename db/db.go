package db

import (
	"log"
	"nextjs-go/auth"
	"os"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"
)

func Init() (*gorm.DB) {
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	db.AutoMigrate(&User{})
	
	return db
}

func CreateUser(c *fiber.Ctx, discordTokenResp auth.DiscordUserResponse) (User, error) {
	db := Init()
	
	fmt.Printf("Database Initialized\n")
	existingUser := User{}
	db.Find(&existingUser, "email = ?", discordTokenResp.Email)
	if existingUser.UserID == "" {
		// User does not exist, proceed with user creation
		newUser := &User{
			UserID:   cuid.New(),
			Email:    *discordTokenResp.Email,
			Username: discordTokenResp.Username,
			Role:     "free",
			Image:    discordTokenResp.Avatar,
		}

		// Create the user record in the database
		db.Create(newUser)
		fmt.Printf("New User Created\n")

		timeLayout := "2006-01-02 15:04:05"
		fmt.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image)

		// Return the newly created user in the JSON response
		return *newUser, nil
	}
	return User{}, fiber.NewError(401, "User Already Exists!")
}
