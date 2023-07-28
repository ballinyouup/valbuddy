package routes

import (
	"github.com/gofiber/fiber/v2"
)

func Home(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
}
