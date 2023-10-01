package auth

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

/**
* Discord OAUTH
**/

// FormatAuthURL formats the OAuth2 authorization URL for Discord.
func (oauth DiscordOAuth2Config) FormatAuthURL() string {
	// URL-encode the redirect URI with the API URL and OAuth's redirect URI.
	redirectURI := url.QueryEscape(fmt.Sprintf("%s%s", oauth.Env.API_URL, oauth.RedirectURI))

	// URL-encode the scope.
	scope := url.QueryEscape(oauth.Scope)

	// Construct the authorization URL with various query parameters.
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&prompt=%s",
		oauth.AuthorizeURL,
		oauth.ResponseType,
		oauth.Env.DISCORD_ID,
		scope,
		oauth.State,
		redirectURI,
		oauth.Prompt,
	)
}

// GetAccessToken retrieves an access token from Discord using the provided authorization code.
func (oauth DiscordOAuth2Config) GetAccessToken(code string) (DiscordResponse, error) {
	// Create a Fiber Agent to manage the HTTP request.
	a := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(a)

	// Prepare the request with HTTP method, URL, and headers.
	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(oauth.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	// Prepare form arguments for the request.
	args := fiber.AcquireArgs()
	defer fiber.ReleaseArgs(args)
	args.Add("client_id", oauth.Env.DISCORD_ID)
	args.Add("client_secret", oauth.Env.DISCORD_SECRET)
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", fmt.Sprintf("%s%s", oauth.Env.API_URL, oauth.RedirectURI))
	a.Form(args)

	// Parse the request using the Agent.
	if err := a.Parse(); err != nil {
		return DiscordResponse{}, fmt.Errorf("error making POST request: %w", err)
	}

	// Extract status, body, and error from the request response.
	status, body, err := a.Bytes()
	if err != nil {
		return DiscordResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}

	// Convert the response body to JSON and handle potential errors.
	var discordResp DiscordResponse
	discordResp.Status = status
	if err := json.Unmarshal(body, &discordResp); err != nil {
		return DiscordResponse{}, fmt.Errorf("error during JSON Unmarshal of Discord Response: %w", err)
	}

	return discordResp, nil
}

// GetUserInfo retrieves user information from Discord using the provided access token.
func (oauth DiscordOAuth2Config) GetUserInfo(discordResp DiscordResponse) (DiscordUserResponse, error) {
	access_token := discordResp.AccessToken

	// Create a Fiber Agent to manage the HTTP request.
	token_agent := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(token_agent)

	// Prepare the request with HTTP method, URL, and authorization header.
	token_req := token_agent.Request()
	token_req.SetRequestURI(oauth.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))

	// Parse the request using the Agent.
	if err := token_agent.Parse(); err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error making GET Request: %w", err)
	}

	// Extract status, body, and error from the request response.
	token_status, token_body, err := token_agent.Bytes()
	if err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}

	// Convert the response body to JSON and handle potential errors.
	var discordTokenResp DiscordUserResponse
	discordTokenResp.Status = token_status
	if err := json.Unmarshal(token_body, &discordTokenResp); err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error during JSON Unmarshal of DiscordTokenResponse: %s", err)
	}

	// Create and format the avatar URL.
	CreateDiscordAvatar(&discordTokenResp)

	return discordTokenResp, nil
}

// CreateDiscordAvatar adds and formats the avatar URL for default and profile images.
func CreateDiscordAvatar(discordTokenResp *DiscordUserResponse) error {
	if discordTokenResp.Avatar == "" {
		// Calculate shard index based on user ID.
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

/**
* Twitch OAUTH
**/

// FormatAuthURL formats the OAuth2 authorization URL for Twitch.
func (oauth TwitchOAuth2Config) FormatAuthURL() string {
	// URL-encode the redirect URI with the API URL and OAuth's redirect URI.
	redirectURI := url.QueryEscape(fmt.Sprintf("%s%s", oauth.Env.API_URL, oauth.RedirectURI))

	// URL-encode the scope.
	scope := url.QueryEscape(oauth.Scope)

	// Construct the authorization URL with various query parameters.
	return fmt.Sprintf("%s?response_type=%s&client_id=%s&scope=%s&state=%s&redirect_uri=%s&force_verify=%s",
		oauth.AuthorizeURL,
		oauth.ResponseType,
		oauth.Env.TWITCH_ID,
		scope,
		oauth.State,
		redirectURI,
		oauth.ForceVerify,
	)
}

// GetAccessToken retrieves an access token from Twitch using the provided authorization code.
func (oauth TwitchOAuth2Config) GetAccessToken(code string) (TwitchResponse, error) {
	// Create a Fiber Agent to manage the HTTP request.
	a := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(a)

	// Prepare the request with HTTP method, URL, and headers.
	req := a.Request()
	req.Header.SetMethod("POST")
	req.SetRequestURI(oauth.AccessTokenURL)
	req.Header.SetContentType("application/x-www-form-urlencoded")

	// Prepare form arguments for the request.
	args := fiber.AcquireArgs()
	defer fiber.ReleaseArgs(args)
	args.Add("client_id", oauth.Env.TWITCH_ID)
	args.Add("client_secret", oauth.Env.TWITCH_SECRET)
	args.Add("grant_type", "authorization_code")
	args.Add("code", code)
	args.Add("redirect_uri", fmt.Sprintf("%s%s", oauth.Env.API_URL, oauth.RedirectURI))
	a.Form(args)

	// Parse the request using the Agent.
	if err := a.Parse(); err != nil {
		return TwitchResponse{}, fmt.Errorf("error making POST Request: %w", err)
	}

	// Extract status, body, and error from the request response.
	status, body, err := a.Bytes()
	if err != nil {
		return TwitchResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}

	// Convert the response body to JSON and handle potential errors.
	var twitchResp TwitchResponse
	twitchResp.Status = status
	if err := json.Unmarshal(body, &twitchResp); err != nil {
		return TwitchResponse{}, fmt.Errorf("error during JSON Unmarshal of TwitchResponse: %w", err)
	}

	return twitchResp, nil
}

// GetUserInfo retrieves user information from Twitch using the provided access token.
func (oauth TwitchOAuth2Config) GetUserInfo(twitchResp TwitchResponse) (TwitchUserResponse, error) {
	access_token := twitchResp.AccessToken

	// Create a Fiber Agent to manage the HTTP request.
	token_agent := fiber.AcquireAgent()
	defer fiber.ReleaseAgent(token_agent)

	// Prepare the request with HTTP method, URL, authorization header, and Client-Id header.
	token_req := token_agent.Request()
	token_req.SetRequestURI(oauth.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	token_req.Header.Add("Client-Id", oauth.Env.TWITCH_ID)

	// Parse the request using the Agent.
	if err := token_agent.Parse(); err != nil {
		return TwitchUserResponse{}, fmt.Errorf("error making GET request: %w", err)
	}

	// Extract status, body, and error from the request response.
	token_status, token_body, err := token_agent.Bytes()
	if err != nil {
		return TwitchUserResponse{}, fmt.Errorf("error extracting status, body, and error: %w", err[0])
	}

	// Convert the response body to JSON and handle potential errors.
	var twitchUserResp TwitchUserResponse
	twitchUserResp.Status = token_status
	if err := json.Unmarshal(token_body, &twitchUserResp); err != nil {
		return TwitchUserResponse{}, fmt.Errorf("error during JSON Unmarshal of TwitchTokenResponse: %s", err)
	}

	return twitchUserResp, nil
}
