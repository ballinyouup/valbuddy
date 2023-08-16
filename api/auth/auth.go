package auth

import (
	"encoding/json"
	"fmt"
	"net/url"
	"nextjs-go/config"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

var DiscordURLS = DiscordLinks{
	AccessTokenURL: "https://discord.com/api/oauth2/token",
	AuthorizeURL:   "https://discord.com/oauth2/authorize",
	RedirectURI:    "/login/discord/callback",
	UserInfoURL:    "https://discord.com/api/v10/users/@me",
}

var TwitchURLS = TwitchLinks{
	AccessTokenURL: "https://id.twitch.tv/oauth2/token",
	AuthorizeURL:   "https://id.twitch.tv/oauth2/authorize",
	RedirectURI:    "/login/twitch/callback",
	UserInfoURL:    "https://api.twitch.tv/helix/users",
}

func (oauth DiscordOAuth2Config) FormatAuthURL() string {
	redirectURI := url.QueryEscape(fmt.Sprintf("%s%s", config.Env.API_URL, oauth.RedirectURI))
	scope := url.QueryEscape(oauth.Scope)
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&prompt=%s",
		oauth.AuthorizeURL,
		oauth.ResponseType,
		oauth.ClientID,
		scope,
		oauth.State,
		redirectURI,
		oauth.Prompt,
	)
}

func (oauth TwitchOAuth2Config) FormatAuthURL() string {
	redirectURI := url.QueryEscape(fmt.Sprintf("%s%s", config.Env.API_URL, oauth.RedirectURI))
	scope := url.QueryEscape(oauth.Scope)
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&force_verify=%s",
		oauth.AuthorizeURL,
		oauth.ResponseType,
		oauth.ClientID,
		scope,
		oauth.State,
		redirectURI,
		oauth.ForceVerify,
	)
}

func (oauth DiscordOAuth2Config) GetAccessToken(code string) (interface{}, error) {
	a := fiber.AcquireAgent() // Create Agent and Add URI/Headers to Request
	defer fiber.ReleaseAgent(a)

	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(DiscordURLS.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	args := fiber.AcquireArgs() // Add Form Arguments to the Request
	defer fiber.ReleaseArgs(args)

	args.Add("client_id", config.Env.DISCORD_ID)
	args.Add("client_secret", config.Env.DISCORD_SECRET)
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", fmt.Sprintf("%s%s", config.Env.API_URL, DiscordURLS.RedirectURI))
	a.Form(args)

	if err := a.Parse(); err != nil { // Initialize Agent
		return DiscordResponse{}, fmt.Errorf("error making POST request: %w", err)
	}
	status, body, err := a.Bytes() // Store Status, Body, and Err. Agent Cannot be used after
	if err != nil {
		return DiscordResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}
	// Create and Convert Response to JSON to check for errors
	var discordResp DiscordResponse
	discordResp.Status = status
	if err := json.Unmarshal(body, &discordResp); err != nil {
		return DiscordResponse{}, fmt.Errorf("error during JSON Unmarshal of Discord Response: %w", err)
	}
	return discordResp, nil
}

func (oauth DiscordOAuth2Config) GetUserInfo(discordResp DiscordResponse) (interface{}, error) {

	access_token := discordResp.AccessToken
	token_agent := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(token_agent)

	token_req := token_agent.Request()
	token_req.SetRequestURI(DiscordURLS.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	if err := token_agent.Parse(); err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error making GET Request: %w", err)
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, err := token_agent.Bytes()
	if err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}
	var discordTokenResp DiscordUserResponse
	discordTokenResp.Status = token_status
	if err := json.Unmarshal(token_body, &discordTokenResp); err != nil {

		return DiscordUserResponse{}, fmt.Errorf("error during JSON Unmarshal of DiscordTokenResponse: %s", err)
	}
	CreateDiscordAvatar(&discordTokenResp)
	return discordTokenResp, nil
}

// Add & Format Avatar String for Default/Profile Images
func CreateDiscordAvatar(discordTokenResp *DiscordUserResponse) error {
	if discordTokenResp.Avatar == "" {
		user_id, err := strconv.Atoi(discordTokenResp.ID)
		if err != nil {
			return fmt.Errorf("error converting to string: %w", err)
		}
		shardIndex := (user_id >> 22) % 6
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/embed/avatars/%d.png", shardIndex)
	} else {
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", discordTokenResp.ID, discordTokenResp.Avatar)
	}
	return nil
}

func (oauth TwitchOAuth2Config) GetAccessToken(code string) (interface{}, error) {
	a := fiber.AcquireAgent() // Create Agent and Add URI/Headers to Request
	defer fiber.ReleaseAgent(a)

	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(TwitchURLS.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	args := fiber.AcquireArgs() // Add Form Arguments to the Request
	defer fiber.ReleaseArgs(args)

	args.Add("client_id", config.Env.TWITCH_ID)
	args.Add("client_secret", config.Env.TWITCH_SECRET)
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", fmt.Sprintf("%s%s", config.Env.API_URL, TwitchURLS.RedirectURI))
	a.Form(args)

	if err := a.Parse(); err != nil { // Initialize Agent
		return TwitchResponse{}, fmt.Errorf("error making POST Request: %w", err)
	}
	status, body, err := a.Bytes() // Store Status, Body, and Err. Agent Cannot be used after
	if err != nil {
		return TwitchResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}
	var twitchResp TwitchResponse
	twitchResp.Status = status
	if err := json.Unmarshal(body, &twitchResp); err != nil {
		return TwitchResponse{}, fmt.Errorf("error during JSON Unmarshal of TwitchResponse: %w", err)
	}
	return twitchResp, nil
}

func (oauth TwitchOAuth2Config) GetUserInfo(twitchResp TwitchResponse) (interface{}, error) {
	access_token := twitchResp.AccessToken
	token_agent := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(token_agent)

	token_req := token_agent.Request()
	token_req.SetRequestURI(TwitchURLS.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	token_req.Header.Add("Client-Id", config.Env.TWITCH_ID)
	if err := token_agent.Parse(); err != nil {
		return TwitchUserResponse{}, fmt.Errorf("error making GET request: %w", err)
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, err := token_agent.Bytes()
	if err != nil {
		return TwitchUserResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}
	var twitchUserResp TwitchUserResponse
	twitchUserResp.Status = token_status
	if err := json.Unmarshal(token_body, &twitchUserResp); err != nil {

		return TwitchUserResponse{}, fmt.Errorf("error during JSON Unmarshal of TwitchTokenResponse: %s", err)
	}
	return twitchUserResp, nil
}
