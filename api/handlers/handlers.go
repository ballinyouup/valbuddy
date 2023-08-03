package handlers

import (
	"fmt"
	"net/url"

	"sveltekit-go/auth"
	"sveltekit-go/config"
	"sveltekit-go/db"

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

func FormatAuthURL(oauth OAuth2Config) string {
	redirectURI := url.QueryEscape(fmt.Sprintf("%s%s", config.Env.API_URL, oauth.RedirectURI))
	scope := url.QueryEscape(oauth.Scope)
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&prompt=%s",
		oauth.AuthorizeURL,
		oauth.ResponseType,
		oauth.ClientID,
		scope,
		oauth.State,
		redirectURI,
		oauth.Prompt,
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
			ClientID:     config.Env.DISCORD_ID,
			Scope:        "identify email",
			State:        state,
			RedirectURI:  "/login/discord/callback",
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
		auth.CheckStateAndCSRF(c)
		status, body, err := auth.GetDiscordAccessToken(code)
		if err != nil {
			return err
		}
		discordTokenResp, err := auth.GetDiscordUserInfo(status, body)
		if err != nil {
			return err
		}
		user, err := db.CreateUser(c, *discordTokenResp.Email, discordTokenResp.Username, "free", discordTokenResp.Avatar, "discord")
		if err != nil {
			return err
		}
		return c.JSON(user)
	case "twitch":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
}
