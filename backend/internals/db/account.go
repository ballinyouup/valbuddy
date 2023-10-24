package db

import (
	"fmt"
	"valbuddy/internals/config"
)

func GetAccount(userID string, a *config.App) (Account, error) {
	// Create an empty User object
	var account Account
	query := Account{
		UserID: userID,
	}
	// Retrieve account data from the database based on the user ID
	if err := a.Database.Where(query).First(&account).Error; err != nil {
		return Account{}, fmt.Errorf("error getting user: %w", err)
	}
	return account, nil
}
