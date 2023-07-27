package auth

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	r "math/rand"
	database "nextjs-go/db"
	"nextjs-go/models"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"
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

func GenerateCSRFToken() string {
	// Generate a random string as the CSRF token
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, 32)
	for i := range b {
		b[i] = letterBytes[r.Intn(len(letterBytes))]
	}
	return string(b)
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

var DiscordURLS = DiscordLinks{
	AccessTokenURL: "https://discord.com/api/oauth2/token",
	AuthorizeURL:   "https://discord.com/oauth2/authorize",
	RedirectURI:    "http://127.0.0.1:3000/login/discord/callback",
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
	args.Add("redirect_uri", DiscordURLS.RedirectURI)
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

type DiscordUserResponse struct {
	Status           int     `json:"status"`
	ID               string  `json:"id"`
	Username         string  `json:"username"`
	Discriminator    string  `json:"discriminator"`
	GlobalName       string  `json:"global_name,omitempty"`
	Avatar           string  `json:"avatar,omitempty"`
	Bot              bool    `json:"bot,omitempty"`
	System           bool    `json:"system,omitempty"`
	MFAEnabled       bool    `json:"mfa_enabled,omitempty"`
	Banner           string  `json:"banner,omitempty"`
	AccentColor      *int    `json:"accent_color,omitempty"`
	Locale           string  `json:"locale,omitempty"`
	Verified         bool    `json:"verified,omitempty"`
	Email            *string `json:"email,omitempty"`
	Flags            *int    `json:"flags,omitempty"`
	PremiumType      *int    `json:"premium_type,omitempty"`
	PublicFlags      *int    `json:"public_flags,omitempty"`
	AvatarDecoration string  `json:"avatar_decoration,omitempty"`
}

func GetDiscordUserInfo(status int, body []byte) (DiscordUserResponse, error) {
	// Create and Convert Response to JSON to check for errors
	var discordResp DiscordResponse
	discordResp.Status = status
	if err := json.Unmarshal(body, &discordResp); err != nil {
		fmt.Println("Error during discordResp json unmarshal:", err)
		return DiscordUserResponse{}, err
	}
	access_token := discordResp.AccessToken
	token_agent := fiber.AcquireAgent()
	token_req := token_agent.Request()
	token_req.SetRequestURI(DiscordURLS.UserInfoURL)
	token_req.Header.SetMethod("GET")
	token_req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", access_token))
	if token_err := token_agent.Parse(); token_err != nil {
		fmt.Println("Error parsing token agent:", token_err)
		return DiscordUserResponse{}, token_err
	}
	// Store Status, Body, and Err. Agent Cannot be used after
	token_status, token_body, token_err := token_agent.Bytes()
	if token_err != nil {
		return DiscordUserResponse{}, fmt.Errorf("error reading token agent bytes: %s", token_err)
	}
	// Release the Agent After We Used it
	defer fiber.ReleaseAgent(token_agent)
	var discordTokenResp DiscordUserResponse
	discordTokenResp.Status = token_status
	if token_err := json.Unmarshal(token_body, &discordTokenResp); token_err != nil {
		fmt.Println("Error during token json unmarshal:", token_err)
		return DiscordUserResponse{}, token_err
	}

	// Format Avatar String for Default/Profile Images
	if discordTokenResp.Avatar == "" {
		user_id, err := strconv.Atoi(discordTokenResp.ID)
		if err != nil {
			fmt.Println("Error Converting to String:", err)
			return DiscordUserResponse{}, err
		}
		shardIndex := (user_id >> 22) % 6
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/embed/avatars/%d.png", shardIndex)
	} else {
		discordTokenResp.Avatar = fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", discordTokenResp.ID, discordTokenResp.Avatar)
	}

	return discordTokenResp, nil
}

func CreateUser(c *fiber.Ctx, discordTokenResp DiscordUserResponse) (models.User, error) {
	db := database.Init()
	if db == nil {
		fmt.Printf("Error initializing database")
	}
	fmt.Printf("Database Initialized\n")
	existingUser := models.User{}
	db.Find(&existingUser, "email = ?", discordTokenResp.Email)
	if existingUser.UserID == "" {
		// User does not exist, proceed with user creation
		newUser := &models.User{
			UserID:   cuid.New(),
			Email:    *discordTokenResp.Email,
			Username: discordTokenResp.Username,
			Role:     "free",
			Image:    discordTokenResp.Avatar,
		}

		// Create the user record in the database
		db.Create(newUser)
		fmt.Printf("New User Created\n")

		timeLayout := "2006-01-02 15:04:05"
		fmt.Printf("CREATE// id: %s, createdAt: %s, email: %s, role: %s, username: %s, image: %s\n",
			newUser.UserID, string(newUser.CreatedAt.Format(timeLayout)), newUser.Email, newUser.Role, newUser.Username, newUser.Image)

		// Return the newly created user in the JSON response
		return *newUser, nil
	}
	return models.User{}, fiber.NewError(401, "User Already Exists!")
}
