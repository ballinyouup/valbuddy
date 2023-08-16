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
	// Check if a user with the same email exists in the database
	existingUser := User{}
	err := Database.Where("email = ?", email).First(&existingUser).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return User{}, fmt.Errorf("error with database: %w", err)
	}

	// If the user doesn't exist, create a new one
	if existingUser.ID == "" {
		// Generate a new unique user ID using cuid
		userId := cuid.New()

		// Create a new User object with provided data
		newUser := &User{
			ID:       userId,
			Email:    email,
			Username: username,
			Role:     role,
			Image:    image,
			Provider: provider,
		}

		// Create a new Account associated with the user
		newAccount := &Account{
			ID:     cuid.New(),
			UserID: userId,
		}

		// Validate the new User's data
		if err := validateCheck(newUser); err != nil {
			return User{}, fmt.Errorf("error validating new user: %w", err)
		}

		// Validate the new Account's data
		if err := validateCheck(newAccount); err != nil {
			return User{}, fmt.Errorf("error validating new account: %w", err)
		}

		// Create the new User record in the database
		if err := Database.Create(newUser).Error; err != nil {
			return User{}, fmt.Errorf("user creation failed: %w", err)
		}

		// Create the new Account record in the database
		if err := Database.Create(newAccount).Error; err != nil {
			return User{}, fmt.Errorf("account creation failed: %w", err)
		}

		// Return the newly created User
		return *newUser, nil
	}

	// If the user exists, check if the provided provider matches the existing provider
	if existingUser.Provider != provider {
		return User{}, fmt.Errorf("incorrect provider")
	}

	// Return the existing User
	return existingUser, nil
}


// validateCheck performs validation on the provided data using the validator library.
// It returns an error containing validation error messages if validation fails,
func validateCheck(data interface{}) error {
	// Attempt to validate the provided data using the validator library
	err := validate.Struct(data)
	if err != nil {
		// If validation fails, store validation error messages
		var validationErrors []string
		// Loop through each validation error and format error messages
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("%s validation failed for field %s", err.Tag(), err.Field()))
		}
		// Construct and return an error message containing all validation errors
		return fmt.Errorf("validation failed: %s", strings.Join(validationErrors, ", "))
	}
	// If validation succeeds, return nil to indicate no errors
	return nil
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
