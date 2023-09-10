package handlers

import (
	"fmt"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)

func GetAccount(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userID := s.Get("user_id").(string)

	account, err := db.GetAccount(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing GetAccount: %s", err))
	}
	// Return the user data as JSON response
	return c.JSON(account)
}

func UpdateAccount(c *fiber.Ctx) error {
	return c.SendString("Updating User Account")
}

func DeleteAccount(c *fiber.Ctx) error {
	return c.SendString("User Account Deleted")
}
