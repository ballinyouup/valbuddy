package main

import (
	"fmt"
	"log"
	"nextjs-go/auth"
	database "nextjs-go/db"
	"nextjs-go/models"
	"os"

	"github.com/lucsky/cuid"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func HandleLogin(c *fiber.Ctx) error {
	state, err := auth.GenerateState()

	if err != nil {
		fmt.Println("Error generating random state:", err)
		return err
	}
	if c.Params("provider") == "discord" {
		// Set the state in a HTTP-only cookie
		c.Cookie(&fiber.Cookie{
			Name:     "oauth2_state",
			Value:    state,
			HTTPOnly: true,
			SameSite: "Lax",
			Secure:   false,
		})

		// Redirect the user to the OAuth2 service for authorization
		result := fmt.Sprintf("%s?response_type=code&client_id=%s&scope=identify%%20email&state=%s&redirect_uri=%s&prompt=consent", auth.DiscordURLS.AuthorizeURL, os.Getenv("DISCORD_ID"), state, "http%3A%2F%2F127.0.0.1:3000/login/discord/callback")
		return c.Redirect(result)
	}
	return nil
}

func HandleProviderCallback(c *fiber.Ctx) error {
	switch c.Params("provider") {
	case "discord":
		code := c.Query("code")
		auth.CheckStateAndCSRF(c, code)
		status, body, err := auth.GetDiscordAccessToken(code)
		if err != nil {
			return fmt.Errorf("error getting discord access token: %s", err)
		}
		discordTokenResp, err := auth.GetDiscordUserInfo(status, body)
		if err != nil {
			return fmt.Errorf("error getting user info: %s", err)
		}
		return c.JSON(discordTokenResp)
	case "google":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
}

// app.Use(cors.New()) // CORS
func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}

	app := fiber.New()

	// App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		db := database.Init()
		if db == nil {
			fmt.Printf("Error initializing database")
		}
		fmt.Printf("Database Initialized\n")
		rand_string, str_err := auth.GenerateState()
		if str_err != nil {
			return err
		}
		// Manually set CreatedAt field before creating the record
		newUser := &models.User{
			UserID:   cuid.New(),
			Email:    "test@test.com" + rand_string,
			Username: "user1" + rand_string,
			Role:     "free" + rand_string,
			Image:    "http://example.com/image" + rand_string,
		}

		// Create the user record in the database
		db.Create(newUser)
		fmt.Printf("New User Created\n")

		timeLayout := "2006-01-02 15:04:05"
		fmt.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image)

		getUsers := []models.User{}
		err := db.Find(&getUsers)
		if err.Error != nil {
			fmt.Printf("Error retrieving user: %s\n", err.Error)
			return err.Error
		}

		return c.JSON(getUsers)
	})
	app.Get("/login/:provider", HandleLogin)
	app.Get("/login/:provider/callback", HandleProviderCallback)

	// App Port
	log.Fatal(app.Listen(":3000"))
}
