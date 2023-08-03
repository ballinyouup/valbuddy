package auth

import (
	"encoding/json"
	"fmt"

	"strconv"
	"sveltekit-go/config"

	"github.com/gofiber/fiber/v2"
)

var DiscordURLS = DiscordLinks{
	AccessTokenURL: "https://discord.com/api/oauth2/token",
	AuthorizeURL:   "https://discord.com/oauth2/authorize",
	RedirectURI:    "/login/discord/callback",
	UserInfoURL:    "https://discord.com/api/v10/users/@me",
}

func GetDiscordAccessToken(code string) (int, []byte, error) {
	// Create Agent and Add URI/Headers to Request
	a := fiber.AcquireAgent()
	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(DiscordURLS.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	// Add Form Arguments to the Request
	args := fiber.AcquireArgs()
	args.Add("client_id", config.Env.DISCORD_ID)
	args.Add("client_secret", config.Env.DISCORD_SECRET)
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)

	args.Add("redirect_uri", fmt.Sprintf("%s%s", config.Env.API_URL, DiscordURLS.RedirectURI))
	a.Form(args)
	defer fiber.ReleaseArgs(args)

	// Initialize Agent
	if err := a.Parse(); err != nil {
		return 0, nil, fmt.Errorf("GetDiscordAccessToken > Error making POST Request: %w", err)
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	status, body, err := a.Bytes()
	if err != nil {
		return 0, nil, fmt.Errorf("GetDiscordAccessToken > Error extracting Status, Body, and Error: %w", err[0])
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(a)
	return status, body, nil
}

func GetDiscordUserInfo(status int, body []byte) (DiscordUserResponse, error) {
	// Create and Convert Response to JSON to check for errors
	var discordResp DiscordResponse
	discordResp.Status = status
	if err := json.Unmarshal(body, &discordResp); err != nil {
		return DiscordUserResponse{}, fmt.Errorf("GetDiscordUserInfo > Error during JSON Unmarshal - DiscordResponse: %w", err)
	}
	access_token := discordResp.AccessToken
	token_agent := fiber.AcquireAgent()
	token_req := token_agent.Request()
	token_req.SetRequestURI(DiscordURLS.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	if err := token_agent.Parse(); err != nil {
		return DiscordUserResponse{}, fmt.Errorf("GetDiscordUserInfo > Error making GET Request: %w", err)
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, err := token_agent.Bytes()
	if err != nil {
		return DiscordUserResponse{}, fmt.Errorf("GetDiscordUserInfo > Error extracting Status, Body, and Error: %w", err[0])
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(token_agent)
	var discordTokenResp DiscordUserResponse
	discordTokenResp.Status = token_status
	if err := json.Unmarshal(token_body, &discordTokenResp); err != nil {

		return DiscordUserResponse{}, fmt.Errorf("GetDiscordUserInfo > Error during JSON Unmarshal - DiscordTokenResponse: %s", err)
	}
	CreateDiscordAvatar(&discordTokenResp)
	return discordTokenResp, nil
}

// Add & Format Avatar String for Default/Profile Images
func CreateDiscordAvatar(discordTokenResp *DiscordUserResponse) error {
	if discordTokenResp.Avatar == "" {
		user_id, err := strconv.Atoi(discordTokenResp.ID)
		if err != nil {
			return fmt.Errorf("CreateDiscordAvatar > Error converting to string: %w", err)
		}
		shardIndex := (user_id >> 22) % 6
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/embed/avatars/%d.png", shardIndex)
	} else {
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", discordTokenResp.ID, discordTokenResp.Avatar)
	}
	return nil
}
