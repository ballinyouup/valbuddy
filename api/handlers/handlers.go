package handlers

import (
	"fmt"
	"log"
	"nextjs-go/auth"
	"nextjs-go/config"
	"nextjs-go/db"
	"time"

	"github.com/gofiber/fiber/v2"
)

func HandleLogin(c *fiber.Ctx) error {
	state, err := auth.GenerateRandomString(8)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleLogin > %s", err))
	}
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
	switch c.Params("provider") {
	case "discord":
		discordAuthConfig := auth.DiscordOAuth2Config{
			AuthorizeURL: auth.DiscordURLS.AuthorizeURL,
			ResponseType: "code",
			ClientID:     config.Env.DISCORD_ID,
			Scope:        "identify email",
			State:        state,
			RedirectURI:  "/login/discord/callback",
			Prompt:       "consent",
		}
		// Redirect the user to the OAuth2 service for authorization
		result := discordAuthConfig.FormatAuthURL()
		return c.Redirect(result)
	case "twitch":
		twitchAuthConfig := auth.TwitchOAuth2Config{
			AuthorizeURL: auth.TwitchURLS.AuthorizeURL,
			ResponseType: "code",
			ClientID:     config.Env.TWITCH_ID,
			Scope:        "user:read:email",
			State:        state,
			RedirectURI:  "/login/twitch/callback",
			ForceVerify:  "true",
		}
		// Redirect the user to the OAuth2 service for authorization
		result := twitchAuthConfig.FormatAuthURL()
		return c.Redirect(result)
	default:
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid Provider")
	}
}

func HandleProviderCallback(c *fiber.Ctx) error {
	var user db.User
	code := c.Query("code")
	err := auth.CheckStateAndCSRF(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
	}
	switch c.Params("provider") {
	case "discord":
		res, err := auth.GetDiscordAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		userData, err := auth.GetDiscordUserInfo(res)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		user, err = db.CreateOrLoginUser(c, *userData.Email, userData.Username, "free", userData.Avatar, "discord")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
	case "twitch":
		res, err := auth.GetTwitchAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		log.Print(res)
		userData, err := auth.GetTwitchUserInfo(res)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		log.Print(userData)
		user, err = db.CreateOrLoginUser(c, userData.Data[0].Email, userData.Data[0].DisplayName, "free", userData.Data[0].ProfileImageURL, "twitch")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		log.Print(user)
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
	s, err := db.Sessions.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
	}
	if !s.Fresh() {
		s.Destroy()
		s, err = db.Sessions.Get(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
	}
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
}
