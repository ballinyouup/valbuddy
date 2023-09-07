package handlers

import (
	"fmt"
	"nextjs-go/config"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)
//TODO: Create a fetch for a users public account profile, no session required: GetPublicUser()
// Handler function that returns User Data as JSON
func GetUser(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userId := s.Get("user_id").(string)
	
	// Create an empty User object
	user := db.User{}
	query := db.User{
		ID: userId,
	}
	// Retrieve user data from the database based on the user ID
	// db.Database.Omit("email", "provider").Where("id = ?", userId).First(&user)
	db.GetDatabase().Where(query).First(&user)

	// Return the user data as JSON response
	return c.JSON(user)
}

// Handler update function that returns the new User Data as JSON
func UpdateUser(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userIdFromSession := s.Get("user_id")
	userId := userIdFromSession.(string)

	
	formData := db.FormData{
		Username: c.FormValue("username") ,
		Image: c.FormValue("image"),
	}
	if err := db.UpdateUserField(c, userId, formData); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Updating Field: %s", err))
	}

	// Return the updated user data by calling the GetUser function
	return GetUser(c)
}

// Handler function that the User from the DB
func DeleteUser(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userId := s.Get("user_id").(string)

	// Create an empty User object
	user := db.User{}
	query := db.User{
		ID: userId,
	}
	// Retrieve user data from the database based on the user ID
	db.GetDatabase().Where(query).First(&user)
	db.GetDatabase().Delete(&user)
	s.Destroy()
	return c.Status(200).Redirect(config.Env.FRONTEND_URL)
}
