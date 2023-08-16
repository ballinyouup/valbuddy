package handlers

import (
	"fmt"
	"net/url"
	"nextjs-go/auth"
	"nextjs-go/config"
	"nextjs-go/db"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetOAuth2ProviderConfig(providerName string) (interface{}, error) {
	switch providerName {
	case "discord":
		return auth.DiscordOAuth2Config{
			AuthorizeURL: auth.DiscordURLS.AuthorizeURL,
			ResponseType: "code",
			ClientID:     config.Env.DISCORD_ID,
			Scope:        "identify email",
			RedirectURI:  "/login/discord/callback",
			Prompt:       "consent",
		}, nil
	case "twitch":
		return auth.TwitchOAuth2Config{
			AuthorizeURL: auth.TwitchURLS.AuthorizeURL,
			ResponseType: "code",
			ClientID:     config.Env.TWITCH_ID,
			Scope:        "user:read:email",
			RedirectURI:  "/login/twitch/callback",
			ForceVerify:  "true",
		}, nil
	default:
		return nil, fmt.Errorf("invalid provider")
	}
}

func HandleLogin(c *fiber.Ctx) error {
	state, err := auth.GenerateRandomString(8)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleLogin > %s", err))
	}
	providerConfig, err := GetOAuth2ProviderConfig(c.Params("provider"))
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
		provider, ok := providerConfig.(auth.DiscordOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleLogin > Unexpected response type from Discord Provider Config")
		}
		provider.State = state
		result := provider.FormatAuthURL()
		return c.Redirect(result)
	case "twitch":
		provider, ok := providerConfig.(auth.TwitchOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleLogin > Unexpected response type from Twitch Provider Config")
		}
		provider.State = state
		result := provider.FormatAuthURL()
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
		providerConfig, err := GetOAuth2ProviderConfig("discord")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		provider, ok := providerConfig.(auth.DiscordOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleLogin > Unexpected response type from Discord Provider Config")
		}
		// Get access token from the provider
		accessToken, err := provider.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}

		// Convert the access token response to a DiscordResponse
		discordAccessToken, ok := accessToken.(auth.DiscordResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleProviderCallback > Unexpected response type from Discord GetAccessToken")
		}

		// Get user info using the access token
		userInfo, err := provider.GetUserInfo(discordAccessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}

		// Convert the user info to a DiscordUserResponse
		discordUserInfo, ok := userInfo.(auth.DiscordUserResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleProviderCallback > Unexpected response type from Discord GetUserInfo")
		}
		// Create or login the user using retrieved data
		user, err = db.CreateUser(c, discordUserInfo.Email, discordUserInfo.Username, "free", discordUserInfo.Avatar, "discord")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
	case "twitch":
		providerConfig, err := GetOAuth2ProviderConfig("twitch")
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		provider, ok := providerConfig.(auth.TwitchOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleLogin > Unexpected response type from Twitch Provider Config")
		}
		// Get access token from the provider
		accessToken, err := provider.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		// Convert the access token response to a TwitchResponse
		twitchAccessToken, ok := accessToken.(auth.TwitchResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleProviderCallback > Unexpected response type from Twitch GetAccessToken")
		}
		// Get user info using the access token
		userInfo, err := provider.GetUserInfo(twitchAccessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
		// Convert the user info to a TwitchUserResponse
		twitchUserInfo, ok := userInfo.(auth.TwitchUserResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "HandleProviderCallback > Unexpected response type from Twitch GetAccessToken")
		}
		// Create or login the user using retrieved data
		user, err = db.CreateUser(c, twitchUserInfo.Data[0].Email, twitchUserInfo.Data[0].DisplayName, "free", twitchUserInfo.Data[0].ProfileImageURL, "twitch")
		if err != nil {
			if err.Error() == "incorrect provider" {
				errorParam := url.QueryEscape("Incorrect Provider")
				return c.Redirect(fmt.Sprintf("%s/login?error=%s", config.Env.FRONTEND_URL, errorParam))
			}
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
		}
	default:
		errorParam := url.QueryEscape("Provider Not Found")
		return c.Redirect(fmt.Sprintf("%s/login?error=%s", config.Env.FRONTEND_URL, errorParam))
	}
	s, err := db.Sessions.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
	}
	// Include user id, expiry, and session id inside session storage
	s.Set("user_id", user.UserID)
	s.Set("session_id", s.ID())
	s.SetExpiry(24 * time.Hour)

	// If the user already has a previous session, delete previous and create a new one.
	if !s.Fresh() {
		s.Regenerate()
	}

	// Save Session to database
	err = s.Save()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("HandleProviderCallback > %s", err))
	}

	return c.Redirect(config.Env.FRONTEND_URL)
}

func HandleLogout(c *fiber.Ctx) error {
	s, err := db.Sessions.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("/user > %s", err))
	}
	if err := s.Destroy(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("/user > %s", err))
	}
	return c.SendStatus(200)
}
