package db

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"

	"gorm.io/gorm"
)

// CreateUser creates a new user or returns an existing user based on provided parameters.
func CreateUser(c *fiber.Ctx, email string, username string, role string, image string, provider string) (User, error) {
	// Check if a user with the same email exists in the database
	existingUser := User{}
	err := GetDatabase().Where("email = ?", email).First(&existingUser).Error
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
			Image:    image,
			Provider: provider,
		}

		// Create a new Account associated with the user
		newAccount := &Account{
			ID:     cuid.New(),
			UserID: userId,
			Role:   role,
		}

		// Validate the new User's data
		if err := ValidateCheck(newUser); err != nil {
			return User{}, fmt.Errorf("error validating new user: %w", err)
		}

		// Validate the new Account's data
		if err := ValidateCheck(newAccount); err != nil {
			return User{}, fmt.Errorf("error validating new account: %w", err)
		}

		// Create the new User record in the database
		if err := GetDatabase().Create(newUser).Error; err != nil {
			return User{}, fmt.Errorf("user creation failed: %w", err)
		}

		// Create the new Account record in the database
		if err := GetDatabase().Create(newAccount).Error; err != nil {
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

type FormData struct {
	Username string
	Image    string
}

// UpdateUserField updates a specific field of a user with a new value.
// It takes the userID, fieldName, and newValue as parameters.
func UpdateUserField(c *fiber.Ctx, userID string, data interface{}) error {
	// Check for empty userID or fieldName
	if userID == "" {
		return fmt.Errorf("empty userId or field name")
	}
	// Convert data to FormData type
	formData, ok := data.(FormData)
	if !ok {
		return fmt.Errorf("error converting data to FormData")
	}

	// Fetch the existing user from the database using the userID
	existingUser := User{}
	if err := GetDatabase().Where("id = ?", userID).First(&existingUser).Error; err != nil {
		return fmt.Errorf("error with database: %w", err)
	}
	if formData.Image != "" {
		existingUser.Image = formData.Image
	}
	if formData.Username != "" {
		existingUser.Username = formData.Username
	}

	// Validate the new field value and existing user.
	if err := ValidateCheck(existingUser); err != nil {
		return fmt.Errorf("error validating existing user: %w", err)
	}

	// Save the updated user back to the database
	if err := GetDatabase().Save(&existingUser).Error; err != nil {
		return fmt.Errorf("error saving updated user to db: %w", err)
	}

	return nil
}
