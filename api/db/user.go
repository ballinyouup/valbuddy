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
		if err := ValidateCheck(newUser); err != nil {
			return User{}, fmt.Errorf("error validating new user: %w", err)
		}

		// Validate the new Account's data
		if err := ValidateCheck(newAccount); err != nil {
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

// UpdateUserField updates a specific field of a user with a new value.
// It takes the userID, fieldName, and newValue as parameters.
func UpdateUserField(c *fiber.Ctx, userID string, fieldName string, value interface{}) error {
	// Check for empty userID or fieldName
	if userID == "" || fieldName == "" {
		return fmt.Errorf("empty userId or field name")
	}

	// Fetch the existing user from the database using the userID
	existingUser := User{}
	if err := Database.Where("user_id = ?", userID).First(&existingUser).Error; err != nil {
		return fmt.Errorf("error with database: %w", err)
	}

	// Type Assert Value to string and check if ok
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("error type asserting newValue to string")
	}

	// If value is empty, do nothing
	if(val == ""){
		return nil
	}

	// Update the specified field with the new value
	switch fieldName {
	case "Email":
		existingUser.Email = val
	case "Username":
		existingUser.Username = val
	case "Role":
		existingUser.Role = val
	case "Image":
		existingUser.Image = val
	default:
		return fmt.Errorf("invalid field name: %s", fieldName)
	}

	// Validate the new field value and existing user.
	if err := ValidateCheck(existingUser); err != nil{
		return fmt.Errorf("error validating existing user: %w", err)
	}

	// Save the updated user back to the database
	if err := Database.Save(&existingUser).Error; err != nil {
		return fmt.Errorf("error saving updated user to db: %w", err)
	}

	return nil
}
