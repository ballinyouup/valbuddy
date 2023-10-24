package db

import (
	"fmt"
	"strings"
	"valbuddy/internals/config"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// validateCheck performs validation on the provided data using the validator library.
// It returns an error containing validation error messages if validation fails,
func ValidateCheck(data interface{}, a *config.App) error {
	// Attempt to validate the provided data using the validator library
	if err := a.Validate.Struct(data); err != nil {
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

func ValidateSession(c *fiber.Ctx, a *config.App) (*session.Session, error){
	s, err := a.Sessions.Get(c)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Session: %s", err))
	}
	// Check if the session is not fresh (has been authenticated)
	if s.Fresh() {
		// If the session is fresh, destroy the session
		s.Destroy()

		// Return an unauthorized error response
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	return s, nil
}