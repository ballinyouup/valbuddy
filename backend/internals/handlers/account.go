package handlers

import (
	"fmt"
	"valbuddy/internals/config"
	"valbuddy/internals/db"

	"github.com/gofiber/fiber/v2"
)

func GetAccountHandler(c *fiber.Ctx, a *config.App) error {
	s, err := db.ValidateSession(c, a)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userID := s.Get("user_id").(string)

	account, err := db.GetAccount(userID, a)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing GetAccount: %s", err))
	}
	// Return the user data as JSON response
	return c.JSON(account)
}

func UpdateAccountHandler(c *fiber.Ctx, a *config.App) error {
	return c.SendString("Updating User Account")
}

func DeleteAccountHandler(c *fiber.Ctx, a *config.App) error {
	return c.SendString("User Account Deleted")
}
