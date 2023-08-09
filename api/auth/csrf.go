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
		return "", fmt.Errorf("GenerateRandomString > Error Creating Random String: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(stateBytes), nil
}

func CheckStateAndCSRF(c *fiber.Ctx) error {
	stateFromCookie := c.Cookies("oauth2_state") // Retrieve the state value from the HTTP-only cookie in the request
	if stateFromCookie == "" {                   // Validate the state received in the callback against the one from the cookie
		return fmt.Errorf("CheckStateAndCSRF > Cookie is empty or blocked") // Invalid state parameter, deny the request
	} else if c.Query("state") != stateFromCookie {
		return fmt.Errorf("CheckStateAndCSRF > State Mismatch")
	} else {
		return nil
	}

}
