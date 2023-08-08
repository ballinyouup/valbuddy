package handlers

import (
	"fmt"
	"log"
	"net/url"
	"time"

	"nextjs-go/auth"
	"nextjs-go/config"
	"nextjs-go/db"

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
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleLogin > %s", err))
	}
	if c.Params("provider") == "discord" {
		// Set the state in a HTTP-only cookie
		c.Cookie(&fiber.Cookie{
			Name:     "oauth2_state",
			Value:    state,
			HTTPOnly: true,
			SameSite: "None",
			Secure:   true,
			Domain:   config.Env.COOKIE_DOMAIN,
			Path:     "/",
		})
		c.Set("Access-Control-Allow-Origin", config.Env.FRONTEND_URL)
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
		err := auth.CheckStateAndCSRF(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		status, body, err := auth.GetDiscordAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		discordTokenResp, err := auth.GetDiscordUserInfo(status, body)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		user, createUserErr := db.CreateOrLoginUser(c, *discordTokenResp.Email, discordTokenResp.Username, "free", discordTokenResp.Avatar, "discord")
		if createUserErr != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", createUserErr))
		}
		s, err := db.Sessions.Get(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		s.Destroy()
		s.Set("user_id", user.UserID)
		s.Set("session_id", s.ID())
		s.SetExpiry(24 * time.Hour)

		// After saving the session, fetch it again to get the updated data
		err = s.Save()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}

		// Fetch the session from storage to get the latest data
		s, err = db.Sessions.Get(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}

		log.Println("userId: ", s.Get("user_id"), "sessionId: ", s.Get("session_id"))
		return c.Redirect(config.Env.FRONTEND_URL)
	case "twitch":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
}
