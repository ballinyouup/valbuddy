package routes

import (
	"fmt"
	"nextjs-go/db"

	"github.com/gofiber/fiber/v2"
)

func Home(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
	app.Get("/hello", func(c *fiber.Ctx) error {
		s, err := db.Sessions.Get(c)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("/hello > %s", err))
		}
		if !s.Fresh() {
			userId := s.Get("user_id")
			user := db.User{}
			db.Database.Find(&user, "user_id = ?", userId)
			return c.SendString(fmt.Sprintf("Welcome %s", user.Username))
		} else {
			s.Destroy()
			return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
		}
	})
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("test!")
	})
}
