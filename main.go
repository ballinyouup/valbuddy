package main

import (
	"fmt"
	"log"
	"nextjs-go/auth"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
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
			SameSite: "Strict",
			Secure:   true,
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
		user, err := auth.CreateUser(c, discordTokenResp)
		if err != nil {
			return fmt.Errorf("%s", err)
		}
		return c.JSON(user)
	case "google":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	app := fiber.New()

	app.Use(logger.New())
	// App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"Welcome": "User"})
	})
	app.Get("/login/:provider", HandleLogin)
	app.Get("/login/:provider/callback", HandleProviderCallback)

	// App Port
	log.Fatal(app.Listen(":3000"))
}
