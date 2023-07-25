package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"
)

// var base_discord_url = "https://discord.com/"
var access_token_url = "https://discord.com/api/oauth2/token"
var authorize_url = "https://discord.com/oauth2/authorize"
var redirect_uri = "http%3A%2F%2F127.0.0.1:3000/login/discord/callback"
var user_info_url = "https://discord.com/api/v10/users/@me"

func generateRandomStateString() (string, error) {
	// Set the length of the state string you want to generate
	stateLength := 8 // You can adjust this length as needed

	// Create a buffer to store the random bytes
	stateBytes := make([]byte, stateLength)

	// Fill the buffer with random bytes
	_, err := rand.Read(stateBytes)
	if err != nil {
		return "", err
	}

	// Convert the random bytes to a base64-encoded string (URL-safe)
	stateString := base64.RawURLEncoding.EncodeToString(stateBytes)
	fmt.Println("Function State Generated: ", stateString)
	return stateString, nil
}

// @Summary Login with a provider
// @Description Redirects to the provider's login page
// @ID handleLogin
// @Param provider path string true "Provider name (e.g., discord)"
// @Success 302 {string} string "Redirects to the provider's login page"
// @Router /login/{provider} [get]
func HandleLogin(c *fiber.Ctx) error {
	state, err := generateRandomStateString()
	fmt.Println("Handle Login State: ", state)
	if err != nil {
		fmt.Println("Error generating random state:", err)
		return err
	}
	if c.Params("provider") == "discord" {
		// Set the state as an HTTP-only cookie
		c.Cookie(&fiber.Cookie{
			Name:     "oauth2_state",
			Value:    state,
			HTTPOnly: true,
			SameSite: "Lax", // Set to "Lax" for cross-origin requests on non-secure connections
			Secure:   false, // Set to true if deployed over HTTPS
			// You can set other cookie options such as MaxAge as needed
		})

		// Redirect the user to the OAuth2 service for authorization
		result := fmt.Sprintf("%s?response_type=code&client_id=%s&scope=identify%%20email&state=%s&redirect_uri=%s&prompt=consent", authorize_url, os.Getenv("DISCORD_ID"), state, redirect_uri)

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
	Status       int    `json:"status"`
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type DiscordTokenResponse struct {
	Status   int    `json:"status"`
	Id       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func HandleProviderCallback(c *fiber.Ctx) error {
	switch c.Params("provider") {
	case "discord":
		// Get Code from Query params
		code := c.Query("code")

		// Retrieve the state value from the HTTP-only cookie in the request
		stateFromCookie := c.Cookies("oauth2_state")
		fmt.Println("Callback Cookie State: ", stateFromCookie)
		// Validate the state received in the callback against the one from the cookie
		if code == "" || stateFromCookie == "" || c.Query("state") != stateFromCookie {
			// Invalid state parameter, deny the request
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid state parameter")
		}

		// Clear the OAuth2 state cookie after it has been validated
		c.ClearCookie("oauth2_state")

		// Create Agent and Add URI/Headers to Request
		a := fiber.AcquireAgent()
		req := a.Request()
		req.Header.SetMethod("POST")
		req.SetRequestURI(access_token_url)
		req.Header.SetContentType("application/x-www-form-urlencoded")

		// Add Form Arguments to the Request
		args := fiber.AcquireArgs()
		args.Add("client_id", os.Getenv("DISCORD_ID"))
		args.Add("client_secret", os.Getenv("DISCORD_SECRET"))
		args.Add("grant_type", "authorization_code")
		args.Add("code", code)
		args.Add("redirect_uri", "http://127.0.0.1:3000/login/discord/callback")
		a.Form(args)
		defer fiber.ReleaseArgs(args)

		// Initialize Agent
		if err := a.Parse(); err != nil {
			fmt.Println("Error parsing first API response:", err)
			return err
		}
		// Store Status, Body, and Err. Agent Cannot be used after
		status, body, err := a.Bytes()
		if err != nil {
			return fmt.Errorf("error during first Bytes function call: %s", err)
		}
		// Release the Agent After We Used it
		defer fiber.ReleaseAgent(a)

		// Create and Convert Response to JSON to check for errors
		var discordResp DiscordResponse
		discordResp.Status = status
		if err := json.Unmarshal(body, &discordResp); err != nil {
			fmt.Println("Error during discordResp json unmarshal:", err)
			return err
		}
		access_token := discordResp.AccessToken
		token_agent := fiber.AcquireAgent()
		token_req := token_agent.Request()
		token_req.SetRequestURI(user_info_url)
		token_req.Header.SetMethod("GET")
		token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
		if token_err := token_agent.Parse(); token_err != nil {
			fmt.Println("Error parsing token agent:", token_err)
			return token_err
		}
		// Store Status, Body, and Err. Agent Cannot be used after
		token_status, token_body, token_err := token_agent.Bytes()
		if token_err != nil {
			return fmt.Errorf("error reading token agent bytes: %s", token_err)
		}
		// Release the Agent After We Used it
		defer fiber.ReleaseAgent(token_agent)
		var discordTokenResp DiscordTokenResponse
		discordTokenResp.Status = token_status
		if token_err := json.Unmarshal(token_body, &discordTokenResp); token_err != nil {
			fmt.Println("Error during token json unmarshal:", token_err)
			return token_err
		}
		return c.JSON(discordTokenResp)
	case "google":
		return nil
	default:
		return c.JSON(fiber.Map{"error": "Incorrect Provider"})
	}
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
