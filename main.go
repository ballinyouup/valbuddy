package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "nextjs-go/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"
)

// var base_discord_url = "https://discord.com/"
var access_token_url = "https://discord.com/api/oauth2/token"
var authorize_url = "https://discord.com/oauth2/authorize"
var redirect_uri = "http%3A%2F%2F127.0.0.1:3000/login/discord/callback"

// var user_info_url = "https://discord.com/api/v10/users/@me"
// var scopes = "identify%20email"

// var discord_client_secret = os.Getenv("DISCORD_SECRET")
// var state = ""
// @Summary Login with a provider
// @Description Redirects to the provider's login page
// @ID handleLogin
// @Param provider path string true "Provider name (e.g., discord)"
// @Success 302 {string} string "Redirects to the provider's login page"
// @Router /login/{provider} [get]
func HandleLogin(c *fiber.Ctx) error {

	if c.Params("provider") == "discord" {
		result := fmt.Sprintf("%s?response_type=code&client_id=%s&scope=identify%%20email&redirect_uri=%s&prompt=consent", authorize_url, os.Getenv("DISCORD_ID"), redirect_uri)
		return c.Redirect(result)
	}
	return nil
}

type DiscordData struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	GrantType    string `json:"grant_type"`
	Code         string `json:"code"`
	RedirectURI  string `json:"redirect_uri"`
}

type DiscordResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

func HandleProviderCallback(c *fiber.Ctx) error {
	if c.Params("provider") == "discord" {
		code := c.Query("code")

		a := fiber.AcquireAgent()
		req := a.Request()
		req.Header.SetMethod("POST")
		req.SetRequestURI(access_token_url)
		req.Header.SetContentType("application/x-www-form-urlencoded")
		args := fiber.AcquireArgs()
		args.Add("client_id", os.Getenv("DISCORD_ID"))
		args.Add("client_secret", os.Getenv("DISCORD_SECRET"))
		args.Add("grant_type", "authorization_code")
		args.Add("code", code)
		args.Add("redirect_uri", "http://127.0.0.1:3000/login/discord/callback")
		a.Form(args)
		if err := a.Parse(); err != nil {
			fiber.ReleaseArgs(args)
			panic(err)
		}
		_, body, err := a.Bytes()
		if err != nil {
			panic(err)
		}

		var discordResp DiscordResponse
		if err := json.Unmarshal(body, &discordResp); err != nil {
			panic(err)
		}

		return c.JSON(discordResp)
	}
	return nil
}

// app.Use(cors.New()) // CORS
// app.Get("/docs/*", swagger.HandlerDefault) // default
func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	app := fiber.New()

	// App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("/docs")
	})
	app.Get("/login/:provider", HandleLogin)
	app.Get("/login/:provider/callback", HandleProviderCallback)
	// Swagger Routes
	app.Static("/docs", "/docs")
	app.Get("/docs/*", swagger.New(swagger.Config{ // custom
		URL:         "http://127.0.0.1:3000/docs/swagger.json",
		DeepLinking: false,
		// Expand ("list") or Collapse ("none") tag groups by default
		DocExpansion: "list",
		// Prefill OAuth ClientId on Authorize popup
		OAuth: &swagger.OAuthConfig{
			AppName:  "Discord",
			ClientId: os.Getenv("DISCORD_ID"),
		},
		// Ability to change OAuth2 redirect uri location
		OAuth2RedirectUrl: "http://127.0.0.1:3000/docs/oauth2-redirect.html",
	}))

	// App Port
	log.Fatal(app.Listen(":3000"))
}
