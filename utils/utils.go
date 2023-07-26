package utils

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func GenerateState() (string, error) {
	stateLength := 8
	stateBytes := make([]byte, stateLength) // Create a buffer to store the random bytes
	_, err := rand.Read(stateBytes)         // Fill the buffer with random bytes
	if err != nil {
		return "", err
	}
	stateString := base64.RawURLEncoding.EncodeToString(stateBytes) // Convert the random bytes to a base64-encoded string (URL-safe)
	return stateString, nil
}

func CheckStateAndCSRF(c *fiber.Ctx, code string) error {
	stateFromCookie := c.Cookies("oauth2_state")                                    // Retrieve the state value from the HTTP-only cookie in the request
	if code == "" || stateFromCookie == "" || c.Query("state") != stateFromCookie { // Validate the state received in the callback against the one from the cookie
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid state parameter") // Invalid state parameter, deny the request
	}
	c.ClearCookie("oauth2_state") // Clear the OAuth2 state cookie after it has been validated
	return nil
}

type DiscordLinks struct {
	AccessTokenURL string
	AuthorizeURL   string
	RedirectURI    string
	UserInfoURL    string
}

func GetDiscordAccessToken(code string, discord_links DiscordLinks) (int, []byte, error) {
	// Create Agent and Add URI/Headers to Request
	a := fiber.AcquireAgent()
	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(discord_links.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	// Add Form Arguments to the Request
	args := fiber.AcquireArgs()
	args.Add("client_id", os.Getenv("DISCORD_ID"))
	args.Add("client_secret", os.Getenv("DISCORD_SECRET"))
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", discord_links.RedirectURI)
	a.Form(args)
	defer fiber.ReleaseArgs(args)

	// Initialize Agent
	if err := a.Parse(); err != nil {
		fmt.Println("Error parsing first API response:", err)
		return 0, nil, err
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	status, body, err := a.Bytes()
	if err != nil {
		return 0, nil, fmt.Errorf("error during first Bytes function call: %s", err)
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(a)
	return status, body, nil
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

func GetDiscordUserInfo(status int, body []byte, discord_links DiscordLinks) (DiscordTokenResponse, error) {
	// Create and Convert Response to JSON to check for errors
	var discordResp DiscordResponse
	discordResp.Status = status
	if err := json.Unmarshal(body, &discordResp); err != nil {
		fmt.Println("Error during discordResp json unmarshal:", err)
		return DiscordTokenResponse{}, err
	}
	access_token := discordResp.AccessToken
	token_agent := fiber.AcquireAgent()
	token_req := token_agent.Request()
	token_req.SetRequestURI(discord_links.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	if token_err := token_agent.Parse(); token_err != nil {
		fmt.Println("Error parsing token agent:", token_err)
		return DiscordTokenResponse{}, token_err
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, token_err := token_agent.Bytes()
	if token_err != nil {
		return DiscordTokenResponse{}, fmt.Errorf("error reading token agent bytes: %s", token_err)
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(token_agent)
	var discordTokenResp DiscordTokenResponse
	discordTokenResp.Status = token_status
	if token_err := json.Unmarshal(token_body, &discordTokenResp); token_err != nil {
		fmt.Println("Error during token json unmarshal:", token_err)
		return DiscordTokenResponse{}, token_err
	}
	return discordTokenResp, nil
}
