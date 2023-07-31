package main

import (
	"log"
	"sveltekit-go/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		fiber.NewError(fiber.StatusInternalServerError, "Error loading .env file:")
	}
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	// App Routes
	routes.Home(app)
	routes.Login(app)

	// App Port
	log.Fatal(app.Listen(":3000"))
}
