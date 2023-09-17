package auth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func GenerateRandomString(stateLength int) (string, error) {
	stateBytes := make([]byte, stateLength)
	_, err := rand.Read(stateBytes)
	if err != nil {
		return "", fmt.Errorf("error creating random string: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(stateBytes), nil
}

func CheckStateAndCSRF(c *fiber.Ctx) error {
	stateFromCookie := c.Cookies("oauth2_state") // Retrieve the state value from the HTTP-only cookie in the request
	if stateFromCookie == "" {
		c.ClearCookie("oauth2_state")                   // Validate the state received in the callback against the one from the cookie
		return fmt.Errorf("cookie is empty or blocked") // Invalid state parameter, deny the request
	} else if c.Query("state") != stateFromCookie {
		c.ClearCookie("oauth2_state")
		return fmt.Errorf("state mismatch")
	} else {
		c.ClearCookie("oauth2_state")
		return nil
	}
}
