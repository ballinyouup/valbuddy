package db

import (
	"fmt"
)

func GetAccount(userID string) (Account, error) {
	// Create an empty User object
	var account Account
	query := Account{
		UserID: userID,
	}
	// Retrieve account data from the database based on the user ID
	if err := GetDatabase().Where(query).First(&account).Error; err != nil {
		return Account{}, fmt.Errorf("error getting user: %w", err)
	}
	return account, nil
}
