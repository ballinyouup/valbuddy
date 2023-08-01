package routes

import (
	"github.com/gofiber/fiber/v2"
)

func Home(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
	app.Get("/hello", func(c *fiber.Ctx) error {
		return c.SendString("Hello!")
	})
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("test!")
	})
}
