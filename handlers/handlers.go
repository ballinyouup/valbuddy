package handlers

import (
	"fmt"
	"net/url"
	"nextjs-go/auth"
	"nextjs-go/db"
	"os"

	"github.com/gofiber/fiber/v2"
)

type OAuth2Config struct {
	AuthorizeURL string
	ResponseType string
	ClientID     string
	Scope        string
	State        string
	RedirectURI  string
	Prompt       string
}

func FormatAuthURL(config OAuth2Config) string {
	redirectURI := url.QueryEscape(config.RedirectURI)
	scope := url.QueryEscape(config.Scope)
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&prompt=%s",
		config.AuthorizeURL,
		config.ResponseType,
		config.ClientID,
		scope,
		config.State,
		redirectURI,
		config.Prompt,
	)
}

func HandleLogin(c *fiber.Ctx) error {
	state, err := auth.GenerateRandomString(8)
	if err != nil {
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

		discordAuthConfig := OAuth2Config{
			AuthorizeURL: auth.DiscordURLS.AuthorizeURL,
			ResponseType: "code",
			ClientID:     os.Getenv("DISCORD_ID"),
			Scope:        "identify email",
			State:        state,
			RedirectURI:  "http://127.0.0.1:3000/login/discord/callback",
			Prompt:       "consent",
		}

		// Redirect the user to the OAuth2 service for authorization
		result := FormatAuthURL(discordAuthConfig)
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
			return err
		}
		discordTokenResp, err := auth.GetDiscordUserInfo(status, body)
		if err != nil {
			return err
		}
		user, err := db.CreateUser(c, discordTokenResp)
		if err != nil {
			return err
		}
		return c.JSON(user)
	case "google":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
}
