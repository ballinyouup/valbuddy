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

func GetOAuth2ProviderConfig(providerName string, mock bool) (interface{}, error) {
	if mock {
		switch providerName {
		case "discord":
			return auth.DiscordOAuth2Config{
				ResponseType:   "code",
				ClientID:       config.Env.DISCORD_ID,
				Scope:          "identify email",
				RedirectURI:    "/login/discord/callback",
				Prompt:         "consent",
				AccessTokenURL: "http://localhost:3001/token",
				AuthorizeURL:   "http://localhost:3001/login/discord/authorize",
				UserInfoURL:    "http://localhost:3001/user/discord",
			}, nil
		case "twitch":
			return auth.TwitchOAuth2Config{
				ResponseType:   "code",
				ClientID:       config.Env.TWITCH_ID,
				Scope:          "user:read:email",
				RedirectURI:    "/login/twitch/callback",
				ForceVerify:    "true",
				AccessTokenURL: "http://localhost:3001/token",
				AuthorizeURL:   "http://localhost:3001/login/twitch/authorize",
				UserInfoURL:    "http://localhost:3001/user/twitch",
			}, nil
		default:
			return nil, fmt.Errorf("invalid provider")
		}
	} else {
		switch providerName {
		case "discord":
			return auth.DiscordOAuth2Config{
				ResponseType:   "code",
				ClientID:       config.Env.DISCORD_ID,
				Scope:          "identify email",
				RedirectURI:    "/login/discord/callback",
				Prompt:         "consent",
				AccessTokenURL: "https://discord.com/api/oauth2/token",
				AuthorizeURL:   "https://discord.com/oauth2/authorize",
				UserInfoURL:    "https://discord.com/api/v10/users/@me",
			}, nil
		case "twitch":
			return auth.TwitchOAuth2Config{
				ResponseType:   "code",
				ClientID:       config.Env.TWITCH_ID,
				Scope:          "user:read:email",
				RedirectURI:    "/login/twitch/callback",
				ForceVerify:    "true",
				AccessTokenURL: "https://id.twitch.tv/oauth2/token",
				AuthorizeURL:   "https://id.twitch.tv/oauth2/authorize",
				UserInfoURL:    "https://api.twitch.tv/helix/users",
			}, nil
		default:
			return nil, fmt.Errorf("invalid provider")
		}
	}
}

func HandleLogin(c *fiber.Ctx, mock bool) error {
	state, err := auth.GenerateRandomString(8)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Generating Random String: %s", err))
	}
	providerConfig, err := GetOAuth2ProviderConfig(c.Params("provider"), mock)
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
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Discord Provider Config")
		}
		provider.State = state
		result := provider.FormatAuthURL()
		return c.Redirect(result)
	case "twitch":
		provider, ok := providerConfig.(auth.TwitchOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Twitch Provider Config")
		}
		provider.State = state
		result := provider.FormatAuthURL()
		return c.Redirect(result)
	default:
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid Provider")
	}
}

func HandleProviderCallback(c *fiber.Ctx, mock bool) error {
	var user db.User
	code := c.Query("code")
	err := auth.CheckStateAndCSRF(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Checking State And CSRF: %s", err))
	}
	provider := c.Params("provider")
	switch provider {
	case "discord":
		providerConfig, err := GetOAuth2ProviderConfig("discord", mock)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting OAuth2 Provider Config: %s", err))
		}
		provider, ok := providerConfig.(auth.DiscordOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Discord Provider Config")
		}
		// Get access token from the provider
		accessToken, err := provider.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Access Token: %s", err))
		}
		// Convert the access token response to a DiscordResponse
		discordAccessToken, ok := accessToken.(auth.DiscordResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Discord GetAccessToken")
		}
		// Get user info using the access token
		userInfo, err := provider.GetUserInfo(discordAccessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting User Info: %s", err))
		}
		// Convert the user info to a DiscordUserResponse
		discordUserInfo, ok := userInfo.(auth.DiscordUserResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Discord GetUserInfo")
		}
		newUser := db.User{
			Email:    discordUserInfo.Email,
			Username: discordUserInfo.Username,
			Role:     "free",
			Account: db.Account{
				Image: discordUserInfo.Avatar,
			},
			Provider: "discord",
		}
		// Create or login the user using retrieved data
		user, err = db.CreateUser(c, newUser)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Creating User: %s", err))
		}
	case "twitch":
		providerConfig, err := GetOAuth2ProviderConfig("twitch", mock)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting OAuth2 Provider Config: %s", err))
		}
		provider, ok := providerConfig.(auth.TwitchOAuth2Config)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Twitch Provider Config")
		}
		// Get access token from the provider
		accessToken, err := provider.GetAccessToken(code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Access Token: %s", err))
		}
		// Convert the access token response to a TwitchResponse
		twitchAccessToken, ok := accessToken.(auth.TwitchResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Twitch GetAccessToken")
		}
		// Get user info using the access token
		userInfo, err := provider.GetUserInfo(twitchAccessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Get Twitch User Info Error: %s", err))
		}
		// Convert the user info to a TwitchUserResponse
		twitchUserInfo, ok := userInfo.(auth.TwitchUserResponse)
		if !ok {
			return fiber.NewError(fiber.StatusInternalServerError, "Unexpected response type from Twitch User Info")
		}

		newUser := db.User{
			Email:    twitchUserInfo.Data[0].Email,
			Username: twitchUserInfo.Data[0].DisplayName,
			Role:     "free",
			Account: db.Account{
				Image: twitchUserInfo.Data[0].ProfileImageURL,
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
