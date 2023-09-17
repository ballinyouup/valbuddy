package handlers

import (
	"fmt"
	"valbuddy/internals/config"
	"valbuddy/internals/db"

	"github.com/gofiber/fiber/v2"
)

// Handler function that returns User Data as JSON
func GetUser(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session
	userID := s.Get("user_id").(string)

	user, err := db.GetUser(userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing GetUser: %s", err))
	}
	// Return the user data as JSON response
	return c.JSON(user)
}

// Handler update function that returns the new User Data as JSON
func UpdateUser(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	// Retrieve the user ID from the session and get user
	userId := s.Get("user_id").(string)
	var user db.User
	query := db.User{
		ID: userId,
	}
	db.GetDatabase().Where(query).First(&user)

	// S3 Configuration
	fileHeader, err := c.FormFile("image")
	if err != nil {
		return fmt.Errorf("error extracting file header from form: %w", err)
	}
	file, err := fileHeader.Open()
	if err != nil {
		file.Close()
		return err
	}
	defer file.Close()
	url, err := config.UploadFile(file, fileHeader.Filename, fmt.Sprintf("%s/", user.Username))
	if err != nil {
		return fmt.Errorf("error executing config.UploadFile: %w", err)
	}
	formData := db.FormData{
		Image: url,
	}
	if err := db.UpdateUserField(c, userId, formData); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Updating Field: %s", err))
	}

	return c.SendStatus(200)
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
	var user db.User
	query := db.User{
		ID: userId,
	}
	// Retrieve user data from the database based on the user ID
	db.GetDatabase().Where(query).First(&user)
	db.GetDatabase().Delete(&user)
	s.Destroy()
	return c.Status(200).Redirect(config.Env.FRONTEND_URL)
}
