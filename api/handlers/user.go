package handlers

import (
	"fmt"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)

// Handler function that returns User Data as JSON
func User(c *fiber.Ctx) error {
	// Get the current session/Error
	s, err := db.Sessions.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Session: %s", err))
	}

	// Check if the session is not fresh (has been authenticated)
	if !s.Fresh() {
		// Retrieve the user ID from the session
		userId := s.Get("user_id")

		// Create an empty User object
		user := db.User{}

		// Retrieve user data from the database based on the user ID
		db.Database.Where("id = ?", userId).First(&user)

		// Return the user data as JSON response
		return c.JSON(user)
	} else {
		// If the session is fresh, destroy the session
		s.Destroy()

		// Return an unauthorized error response
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
}

