package handlers

import (
	"fmt"
	"nextjs-go/config"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)

// Handler function that returns User Data as JSON
func GetUser(c *fiber.Ctx) error {
	// Get the current session/Error
	s, err := db.GetSessions().Get(c)
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
		// db.Database.Omit("email", "provider").Where("id = ?", userId).First(&user)
		db.GetDatabase().Where("id = ?", userId).First(&user)

		// Return the user data as JSON response
		return c.JSON(user)
	} else {
		// If the session is fresh, destroy the session
		s.Destroy()

		// Return an unauthorized error response
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
}
//TODO: Refactor to not call UpdateUserField three times
// Handler update function that returns the new User Data as JSON
func UpdateUser(c *fiber.Ctx) error {
	// Get the current session/Error
	s, err := db.GetSessions().Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Session: %s", err))
	}

	// Check if the session is not fresh (has been authenticated)
	if !s.Fresh() {
		// Retrieve the user ID from the session
		userIdFromSession := s.Get("user_id")
		userId := userIdFromSession.(string)
		if err := db.UpdateUserField(c, userId, "email", c.FormValue("email")); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Updating Field: %s", err))
		}
		if err := db.UpdateUserField(c, userId, "username", c.FormValue("username")); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Updating Field: %s", err))
		}
		if err := db.UpdateUserField(c, userId, "image", c.FormValue("image")); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Updating Field: %s", err))
		}
		// Return the updated user data by calling the GetUser function
		return GetUser(c)
	} else {
		// If the session is fresh, destroy the session
		s.Destroy()

		// Return an unauthorized error response
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
}

// Handler function that the User from the DB
func DeleteUser(c *fiber.Ctx) error {
	// Get the current session/Error
	s, err := db.GetSessions().Get(c)
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
		db.GetDatabase().Where("id = ?", userId).First(&user)
		db.GetDatabase().Delete(&user)
		s.Destroy()
		return c.Status(200).Redirect(config.Env.FRONTEND_URL)
	} else {
		// If the session is fresh, destroy the session
		s.Destroy()

		// Return an unauthorized error response
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
}
