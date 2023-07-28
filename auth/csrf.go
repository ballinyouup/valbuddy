package auth

import (
	"crypto/rand"
	"encoding/base64"
	r "math/rand"

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
