package handlers

import (
	"fmt"
	"log"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"valbuddy/internals/auth"
	"valbuddy/internals/config"
	"valbuddy/internals/db"
	"valbuddy/internals/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm/logger"
	// "github.com/gofiber/fiber/v2/middleware/logger"
)

var app *fiber.App

// Uncomment logger middleware for API request logging/debugging tests.
func TestMain(m *testing.M) {
	var err error
	if _, err = config.LoadConfig("../../.env"); err != nil {
		log.Fatalf("error loading configuration: %s", err)
	}
	if err := db.Init(config.Env.TEST_DB, logger.Silent); err != nil {
		log.Fatalf("error initializing database: %s", err)
	}
	app = fiber.New()
	// app.Use(logger.New())
	Routes(app)
	// Start server
	go func() {
		app.Listen("localhost:3001")
	}()

	// Run tests
	code := m.Run()

	// Stop server
	app.Shutdown()

	os.Exit(code)
}

func TestAuthFlow(t *testing.T) {
	t.Run("Pre-Test Cleanup", func(t *testing.T) {
		DeleteDataFromDB(t)
	})

	t.Run("Discord OAuth Flow", func(t *testing.T) {
		HandlersTest(t, "discord")
	})

	t.Run("Twitch OAuth Flow", func(t *testing.T) {
		HandlersTest(t, "twitch")
	})
}

func Routes(app *fiber.App) {
	discord_cfg := auth.DiscordOAuth2Config{
		ResponseType:   "code",
		Scope:          "identify email",
		RedirectURI:    "/login/discord/callback",
		Prompt:         "consent",
		AccessTokenURL: "http://localhost:3001/token",
		AuthorizeURL:   "http://localhost:3001/login/discord/authorize",
		UserInfoURL:    "http://localhost:3001/user/discord",
		Env:            config.Env,
	}
	twitch_cfg := auth.TwitchOAuth2Config{
		ResponseType:   "code",
		Scope:          "user:read:email",
		RedirectURI:    "/login/twitch/callback",
		ForceVerify:    "true",
		AccessTokenURL: "http://localhost:3001/token",
		AuthorizeURL:   "http://localhost:3001/login/twitch/authorize",
		UserInfoURL:    "http://localhost:3001/user/twitch",
		Env:            config.Env,
	}

	providers := auth.Providers{
		Discord: discord_cfg,
		Twitch:  twitch_cfg,
	}
	app.Get("/login/:provider", func(c *fiber.Ctx) error {

		return HandleLogin(c, providers)
	})
	app.Get("/login/:provider/callback", func(c *fiber.Ctx) error {
		return HandleProviderCallback(c, providers)
	})
	app.Post("/token", func(c *fiber.Ctx) error {
		res := fiber.Map{
			"status":        200,
			"access_token":  "zMndOe7jFLXGwxMOdNvXjjOce5Xxx1",
			"token_type":    "Bearer",
			"expires_in":    604800,
			"refresh_token": "mgp8qnvBwJwgCYKyYD5CAzGAX4sw3f",
			"scope":         "email",
		}
		return c.JSON(res)
	})
	app.Get("/login/:provider/authorize", func(c *fiber.Ctx) error {
		provider := c.Params("provider")
		queries := c.Queries()

		requiredParams := map[string][]string{
			"discord": {"response_type", "client_id", "scope", "state", "redirect_uri", "prompt"},
			"twitch":  {"response_type", "client_id", "scope", "state", "redirect_uri", "force_verify"},
		}

		code, err := auth.GenerateRandomString(8)
		if err != nil {
			log.Fatalf("Error generating code: %v", err)
		}

		// Validate the parameters based on the provider
		for _, param := range requiredParams[provider] {
			if queries[param] == "" {
				log.Fatalf("Missing Param: %s", param)
			}
		}

		// Check if the provider is supported
		if _, exists := requiredParams[provider]; !exists {
			return fiber.NewError(fiber.StatusInternalServerError, "Incorrect Provider")
		}
		return c.Redirect(fmt.Sprintf("http://localhost:3001/login/%s/callback?code=%s", provider, code))
	})

	app.Get("/user/:provider", func(c *fiber.Ctx) error {
		switch c.Params("provider") {
		case "discord":
			// Check for the Authorization header
			authHeader := c.Get("Authorization")
			if authHeader == "" {
				log.Fatalf("No authorization header found in user")
			}
			accessToken := strings.Split(authHeader, "Bearer ")[1]
			// Check if the Authorization header starts with "Bearer "
			if accessToken == "" {
				log.Fatalf("No Bearer access token found in user")
			}
			user := auth.DiscordUserResponse{
				Status:           200,
				ID:               "268473310986240001",
				Username:         "test_username",
				Discriminator:    "0001",
				GlobalName:       "test_global_name",
				Avatar:           "8342729096ea3675442027381ff50dfe",
				Bot:              false,
				System:           false,
				MFAEnabled:       false,
				Banner:           "06c16474723fe537c283b8efa61a30c8",
				AccentColor:      135424,
				Locale:           "en",
				Verified:         true,
				Email:            "test_email@email.com",
				Flags:            64,
				PremiumType:      1,
				PublicFlags:      131072,
				AvatarDecoration: "test_avatar_decoration",
			}
			return c.JSON(user)

		case "twitch":
			// Check for the Authorization header
			authHeader := c.Get("Authorization")
			if authHeader == "" {
				log.Fatalf("No authorization header found in user")
			}
			accessToken := strings.Split(authHeader, "Bearer ")[1]
			// Check if the Authorization header starts with "Bearer "
			if accessToken == "" {
				log.Fatalf("No Bearer access token found in user")
			}
			user := auth.TwitchUserResponse{
				Status: 200,
				Data: []struct {
					ID              string "json:\"id\""
					Login           string "json:\"login\""
					DisplayName     string "json:\"display_name\""
					Type            string "json:\"type\""
					BroadcasterType string "json:\"broadcaster_type\""
					Description     string "json:\"description\""
					ProfileImageURL string "json:\"profile_image_url\""
					OfflineImageURL string "json:\"offline_image_url\""
					ViewCount       int    "json:\"view_count\""
					Email           string "json:\"email\""
					CreatedAt       string "json:\"created_at\""
				}{
					{
						ID:              "123456789",
						Login:           "mock_login",
						DisplayName:     "Mock DisplayName",
						Type:            "mock_type",
						BroadcasterType: "mock_broadcaster_type",
						Description:     "This is a mock description.",
						ProfileImageURL: "http://example.com/mock_profile_image.jpg",
						OfflineImageURL: "http://example.com/mock_offline_image.jpg",
						ViewCount:       999,
						Email:           "mock_email@example.com",
						CreatedAt:       "2023-01-01T00:00:00Z",
					},
				},
			}
			return c.JSON(user)

		default:
			return fiber.NewError(fiber.StatusInternalServerError, "Incorrect provider or error with user response")
		}
	})

}

func DeleteDataFromDB(t *testing.T) {
	tx := db.GetDatabase().Begin()

	if tx.Error != nil {
		t.Fatalf("Database Transaction Error: %v ❌", tx.Error)
	}

	// Execute the DELETE statements
	tables := []string{"accounts", "users", "sessions", "posts"}
	for _, table := range tables {
		if err := tx.Exec("DELETE FROM " + table).Error; err != nil {
			tx.Rollback()
			t.Fatalf("Error deleting data from %v: %v ❌", table, err)
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		t.Fatalf("Transaction Commit Error: %v ❌", err)
	}
}

func HandlersTest(t *testing.T, provider string) {
	providerTitle := utils.Title(provider)

	t.Run(provider+" Login Handler", func(t *testing.T) {
		resp, err := app.Test(httptest.NewRequest("GET", "/login/"+provider, nil))
		if err != nil {
			t.Fatalf("Error running get request: %v", err)
		}
		location, err := resp.Location()
		if err != nil {
			t.Logf("Error getting Location from response: %v", err)
		}

		// Extracting the location string up to the 'state' parameter
		actualLocation := location.String()
		var expectedPrefix string
		if provider == "discord" {
			expectedPrefix = "http://localhost:3001/login/discord/authorize?response_type=code&client_id=1131071708493787178&scope=identify+email&state="
		} else {
			expectedPrefix = "http://localhost:3001/login/twitch/authorize?response_type=code&client_id=pg3xmfvf5g35kzqbrpcd5j5nrgszmm&scope=user%3Aread%3Aemail&state="
		}

		// Checking the location prefix
		if !strings.HasPrefix(actualLocation, expectedPrefix) {
			t.Fatalf("%v Login Handler Location prefix mismatch - got: %v, want prefix: %v ❌", providerTitle, actualLocation, expectedPrefix)
		}
	})

	t.Run(provider+" Login Callback", func(t *testing.T) {
		resp, err := app.Test(httptest.NewRequest("GET", "/login/"+provider, nil))
		if err != nil {
			t.Fatalf("Error running get request: %v", err)
		}

		callbackURL := "http://localhost:3001/login/" + provider + "/callback?state=" + resp.Cookies()[0].Value

		// Create new request for the callback
		callbackReq := httptest.NewRequest("GET", callbackURL, nil)

		// Set the Cookie header on the new request
		callbackReq.AddCookie(resp.Cookies()[0])

		res, err := app.Test(callbackReq)
		if err != nil || res.StatusCode != 302 {
			t.Fatalf("%v Callback Handler Error: %v ❌", providerTitle, err.Error())
		}
	})
}
