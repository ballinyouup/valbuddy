package db

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"

	"gorm.io/gorm"
)

// CreateUser creates a new user or returns an existing user based on provided parameters.
func CreateUser(c *fiber.Ctx, email string, username string, role string, image string, provider string) (User, error) {
	// Check if the user already exists in the database
	existingUser := User{}
	err := Database.Where("email = ?", email).First(&existingUser).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return User{}, fmt.Errorf("error with database: %w", err)
	}

	if existingUser.UserID == "" {
		// User does not exist, proceed with user creation
		newUser := &User{
			UserID:   cuid.New(),
			Email:    email,
			Username: username,
			Role:     role,
			Image:    image,
			Provider: provider,
		}

		// Validate the new user's struct
		err := validate.Struct(newUser)
		if err != nil {
			var validationErrors []string
			for _, err := range err.(validator.ValidationErrors) {
				validationErrors = append(validationErrors, fmt.Sprintf("%s validation failed for field %s", err.Tag(), err.Field()))
			}
			return User{}, fmt.Errorf("new user failed validation: %s", strings.Join(validationErrors, ", "))
		}

		// Create the user record in the database
		err = Database.Create(newUser).Error
		if err != nil {
			return User{}, err
		}

		return *newUser, nil
	}

	// Check if the existing user's provider matches the requested provider
	if existingUser.Provider != provider {
		return User{}, fmt.Errorf("incorrect provider")
	}

	// Return Existing User
	return existingUser, nil
}


// UpdateUserField updates a specific field of a user with a new value.
// It takes the userID, fieldName, and newValue as parameters.
func UpdateUserField(c *fiber.Ctx, userID string, fieldName string, newValue interface{}) error {
    // Check for empty userID or fieldName
    if userID == "" || fieldName == "" {
        return fmt.Errorf("empty userId or field name")
    }

    // Fetch the existing user from the database using the userID
    existingUser := User{}
    err := Database.Where("user_id = ?", userID).First(&existingUser).Error
    if err != nil {
        return fmt.Errorf("error with database: %w", err)
    }

    // Update the specified field with the new value
    switch fieldName {
    case "Email":
        existingUser.Email = newValue.(string)
    case "Username":
        existingUser.Username = newValue.(string)
    case "Role":
        existingUser.Role = newValue.(string)
    case "Image":
        existingUser.Image = newValue.(string)
    default:
        return fmt.Errorf("invalid field name: %s", fieldName)
    }

    // Validate the user struct after updating
    err = validate.Struct(existingUser)
    if err != nil {
        var validationErrors []string
        for _, err := range err.(validator.ValidationErrors) {
            validationErrors = append(validationErrors, fmt.Sprintf("%s validation failed for field %s", err.Tag(), err.Field()))
        }
        return fmt.Errorf("user update failed validation: %s", strings.Join(validationErrors, ", "))
    }

    // Save the updated user back to the database
    err = Database.Save(&existingUser).Error
    if err != nil {
        return err
    }

    return nil
}
