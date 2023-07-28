package main

import (
	"fmt"
	"log"
	"nextjs-go/routes"

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
	routes.Home(app)
	routes.Login(app)

	// App Port
	log.Fatal(app.Listen(":3000"))
}
