package auth

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/gofiber/fiber/v2"
)

func GenerateRandomString(stateLength int) (string, error) {
	stateBytes := make([]byte, stateLength)
	_, err := rand.Read(stateBytes)
	if err != nil {
		return "", fiber.NewError(fiber.StatusInternalServerError, "Error Creating Random String")
	}
	return base64.RawURLEncoding.EncodeToString(stateBytes), nil
}

func CheckStateAndCSRF(c *fiber.Ctx) error {
	stateFromCookie := c.Cookies("oauth2_state")                      // Retrieve the state value from the HTTP-only cookie in the request
	if stateFromCookie == "" || c.Query("state") != stateFromCookie { // Validate the state received in the callback against the one from the cookie
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid state parameter") // Invalid state parameter, deny the request
	}
	c.ClearCookie("oauth2_state") // Clear the OAuth2 state cookie after it has been validated
	return nil
}
