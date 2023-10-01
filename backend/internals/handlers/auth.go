package handlers

import (
	"fmt"
	"net/url"
	"time"
	"valbuddy/internals/auth"
	"valbuddy/internals/config"
	"valbuddy/internals/db"

	"github.com/gofiber/fiber/v2"
)

func HandleLogin(c *fiber.Ctx, oauth auth.Providers) error {
	state, err := auth.GenerateRandomString(8)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Generating Random String: %s", err))
	}
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid Provider")
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
	switch c.Params("provider") {
	case "discord":
		oauth.Discord.State = state
		result := oauth.Discord.FormatAuthURL()
		return c.Redirect(result)
	case "twitch":
		
		oauth.Twitch.State = state
		result := oauth.Twitch.FormatAuthURL()
		return c.Redirect(result)
	default:
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid Provider")
	}
}

func HandleProviderCallback(c *fiber.Ctx, oauth auth.Providers) error {
	var user db.User
	code := c.Query("code")
	err := auth.CheckStateAndCSRF(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Checking State And CSRF: %s", err))
	}
	provider := c.Params("provider")
	switch provider {
	case "discord":
		// Get access token from the provider
		accessToken, err := oauth.Discord.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Access Token: %s", err))
		}
		// Get user info using the access token
		userInfo, err := oauth.Discord.GetUserInfo(accessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting User Info: %s", err))
		}

		newUser := db.User{
			Email:    userInfo.Email,
			Username: userInfo.Username,
			Role:     "free",
			Account: db.Account{
				Image: userInfo.Avatar,
			},
			Provider: "discord",
		}
		// Create or login the user using retrieved data
		user, err = db.CreateUser(c, newUser)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Creating User: %s", err))
		}
	case "twitch":
		
		// Get access token from the provider
		accessToken, err := oauth.Twitch.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Access Token: %s", err))
		}
		// Get user info using the access token
		userInfo, err := oauth.Twitch.GetUserInfo(accessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Get Twitch User Info Error: %s", err))
		}

		newUser := db.User{
			Email:    userInfo.Data[0].Email,
			Username: userInfo.Data[0].DisplayName,
			Role:     "free",
			Account: db.Account{
				Image: userInfo.Data[0].ProfileImageURL,
			},
			Provider: "twitch",
		}

		// Create or login the user using retrieved data
		user, err = db.CreateUser(c, newUser)
		if err != nil {
			if err.Error() == "incorrect provider" {
				errorParam := url.QueryEscape("Incorrect Provider")
				return c.Redirect(fmt.Sprintf("%s/login?error=%s", config.Env.FRONTEND_URL, errorParam))
			}
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Create User Error: %s", err))
		}
	default:
		errorParam := url.QueryEscape("Provider Not Found")
		return c.Redirect(fmt.Sprintf("%s/login?error=%s", config.Env.FRONTEND_URL, errorParam))
	}
	s, err := db.GetSessions().Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("GET Session Error:  %s", err))
	}
	// If the user already has a previous session, delete previous and create a new one.
	if !s.Fresh() {
		if err = s.Regenerate(); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Regenerate Session Error: %s", err))
		}
	}

	// Include user id, expiry, and session id inside session storage
	s.Set("user_id", user.ID)
	s.Set("session_id", s.ID())
	s.SetExpiry(24 * time.Hour)

	// Save Session to database
	if err = s.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("DB Save Error: %s", err))
	}

	return c.Redirect(config.Env.FRONTEND_URL)
}

func HandleLogout(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}
	if err := s.Destroy(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Destroy Session Error: %s", err))
	}
	return c.SendStatus(200)
}
