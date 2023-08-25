package db

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// validateCheck performs validation on the provided data using the validator library.
// It returns an error containing validation error messages if validation fails,
func ValidateCheck(data interface{}) error {
	// Attempt to validate the provided data using the validator library
	if err := GetValidate().Struct(data); err != nil {
		// If validation fails, store validation error messages
		var validationErrors []string

		// Loop through each validation error and format error messages
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("%s validation failed for field %s", err.Tag(), err.Field()))
		}

		// Construct and return an error message containing all validation errors
		return fmt.Errorf("validation failed: %s", strings.Join(validationErrors, ", "))
	}

	return nil
}
