package db

import (
	"fmt"
	"valbuddy/internals/config"

	"github.com/gofiber/fiber/v2"
	"github.com/lucsky/cuid"

	"gorm.io/gorm"
)

// CreateUser creates a new user or returns an existing user based on provided parameters.
func CreateUser(c *fiber.Ctx, newUser User, a *config.App) (User, error) {
	// Check if a user with the same email exists in the database
	existingUser := User{}
	query := User{
		Email: newUser.Email,
	}
	err := a.Database.Where(query).First(&existingUser).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return User{}, fmt.Errorf("error with database: %w", err)
	}

	// If the user doesn't exist, create a new one
	if existingUser.ID == "" {
		// Generate a new unique user ID using cuid
		userId := cuid.New()

		// TODO: Add check if username already exists
		// Create a new User object with provided data
		createdUser := User{
			ID:       userId,
			Email:    newUser.Email,
			Username: newUser.Username,
			Provider: newUser.Provider,
			Role:     newUser.Role,
			Account: Account{
				ID:       cuid.New(),
				UserID:   userId,
				Username: newUser.Username,
				Image:    newUser.Account.Image,
			},
		}

		// Validate the new User's data
		if err := ValidateCheck(createdUser,a); err != nil {
			return User{}, fmt.Errorf("error validating new user: %w", err)
		}

		// Validate the new Account's data
		if err := ValidateCheck(createdUser.Account, a); err != nil {
			return User{}, fmt.Errorf("error validating new account: %w", err)
		}

		// Create the new User record in the database
		if err := a.Database.Create(&createdUser).Error; err != nil {
			return User{}, fmt.Errorf("user creation failed: %w", err)
		}

		// Return the newly created User
		return createdUser, nil
	}

	// If the user exists, check if the provided provider matches the existing provider
	if existingUser.Provider != newUser.Provider {
		return User{}, fmt.Errorf("incorrect provider")
	}

	// Return the existing User
	return existingUser, nil
}

func GetUser(userID string, a *config.App) (User, error) {
	// Create an empty User object
	var user User
	query := User{
		ID: userID,
	}
	// Retrieve user data from the database based on the user ID
	// db.Database.Omit("email", "provider").Where("id = ?", userId).First(&user)
	if err := a.Database.Omit("Account", "Posts").Where(query).First(&user).Error; err != nil {
		return User{}, fmt.Errorf("error getting user: %w", err)
	}
	return user, nil
}

type FormData struct {
	Image string
}

func UpdateUserField(c *fiber.Ctx, userID string, formData FormData, a *config.App) error {
	// Check for empty userID or fieldName
	if userID == "" {
		return fmt.Errorf("error updating user: no user id")
	}

	// Create a map to store the fields you want to update
	updates := map[string]interface{}{}

	// Update user fields based on non-empty form data
	if formData.Image != "" {
		updates["Image"] = formData.Image
	}

	query := &User{
		ID: userID,
	}

	// Use Updates to save the updated fields back to the database
	if err := a.Database.Model(&User{}).Where(query).Updates(updates).Error; err != nil {
		return fmt.Errorf("error updating user in the database: %w", err)
	}

	return nil
}
