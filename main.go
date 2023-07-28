package main

import (
	"fmt"
	"log"
	"nextjs-go/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)



func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
	}
	app := fiber.New()

	app.Use(logger.New())
	// App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
	app.Get("/login/:provider", handlers.HandleLogin)
	app.Get("/login/:provider/callback", handlers.HandleProviderCallback)

	// App Port
	log.Fatal(app.Listen(":3000"))
}
