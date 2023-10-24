package routes

import (
	"valbuddy/internals/auth"
	"valbuddy/internals/config"
	"valbuddy/internals/handlers"

	"github.com/gofiber/fiber/v2"
)


func Auth(app *fiber.App, a *config.App) {
	discord := auth.DiscordOAuth2Config{
		ResponseType:   "code",
		Scope:          "identify email",
		RedirectURI:    "/login/discord/callback",
		Prompt:         "consent",
		AccessTokenURL: "https://discord.com/api/oauth2/token",
		AuthorizeURL:   "https://discord.com/oauth2/authorize",
		UserInfoURL:    "https://discord.com/api/v10/users/@me",
		Env:            a.Env,
	}
	twitch := auth.TwitchOAuth2Config{
		ResponseType:   "code",
		Scope:          "user:read:email",
		RedirectURI:    "/login/twitch/callback",
		ForceVerify:    "true",
		AccessTokenURL: "https://id.twitch.tv/oauth2/token",
		AuthorizeURL:   "https://id.twitch.tv/oauth2/authorize",
		UserInfoURL:    "https://api.twitch.tv/helix/users",
		Env:            a.Env,
	}

	providers := auth.Providers{
		Discord: discord,
		Twitch:  twitch,
	}
	app.Get("/login/:provider", func(c *fiber.Ctx) error {
		return handlers.HandleLogin(c, providers, a)
	})
	app.Get("/login/:provider/callback", func(c *fiber.Ctx) error {
		return handlers.HandleProviderCallback(c, providers, a)
	})
	app.Get("/logout", func(c *fiber.Ctx) error {
		return handlers.HandleLogout(c, a)
	})
}
