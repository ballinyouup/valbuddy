package routes

import (
	"nextjs-go/handlers"
	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App) {
	app.Get("/user", handlers.User)
}
