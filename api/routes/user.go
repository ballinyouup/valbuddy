package routes

import (
	"nextjs-go/handlers"
	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App) {
	app.Get("/user", handlers.GetUser)
	app.Post("/user/update", handlers.UpdateUser)
	app.Delete("/user/delete", handlers.DeleteUser)
}
