package routes

import (
	"fmt"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App) {
	app.Get("/user", func(c *fiber.Ctx) error {
		s, err := db.Sessions.Get(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Error Getting Session: %s", err))
		}
		if !s.Fresh() {
			userId := s.Get("user_id")
			user := db.User{}
			db.Database.Where("user_id = ?", userId).First(&user)
			return c.JSON(user)
		} else {
			s.Destroy()
			return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
		}
	})
}
