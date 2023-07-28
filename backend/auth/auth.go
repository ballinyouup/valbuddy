package auth

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"

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
	args.Add("client_id", os.Getenv("DISCORD_ID"))
	args.Add("client_secret", os.Getenv("DISCORD_SECRET"))
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", fmt.Sprintf("%s%s", os.Getenv("BASE_URL"), DiscordURLS.RedirectURI))
	a.Form(args)
	defer fiber.ReleaseArgs(args)

	// Initialize Agent
	if err := a.Parse(); err != nil {
		return 0, nil, fiber.NewError(fiber.StatusInternalServerError, "Error parsing first API response")
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	status, body, err := a.Bytes()
	if err != nil {
		return 0, nil, fiber.NewError(fiber.StatusInternalServerError, "Error during First Body Call")
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
		return DiscordUserResponse{}, fiber.NewError(fiber.StatusInternalServerError, "Error during discordResp json unmarshal")
	}
	access_token := discordResp.AccessToken
	token_agent := fiber.AcquireAgent()
	token_req := token_agent.Request()
	token_req.SetRequestURI(DiscordURLS.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	if token_err := token_agent.Parse(); token_err != nil {
		return DiscordUserResponse{}, fiber.NewError(fiber.StatusInternalServerError, "Error parsing token agent")
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, token_err := token_agent.Bytes()
	if token_err != nil {
		return DiscordUserResponse{}, fiber.NewError(fiber.StatusInternalServerError, "Error reading token bytes")
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(token_agent)
	var discordTokenResp DiscordUserResponse
	discordTokenResp.Status = token_status
	if token_err := json.Unmarshal(token_body, &discordTokenResp); token_err != nil {

		return DiscordUserResponse{}, fiber.NewError(fiber.StatusInternalServerError, "Error during token json unmarshal")
	}
	CreateDiscordAvatar(&discordTokenResp)
	return discordTokenResp, nil
}

// Add & Format Avatar String for Default/Profile Images
func CreateDiscordAvatar(discordTokenResp *DiscordUserResponse) error {
	if discordTokenResp.Avatar == "" {
		user_id, err := strconv.Atoi(discordTokenResp.ID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Error Converting to String")
		}
		shardIndex := (user_id >> 22) % 6
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/embed/avatars/%d.png", shardIndex)
	} else {
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", discordTokenResp.ID, discordTokenResp.Avatar)
	}
	return nil
}
