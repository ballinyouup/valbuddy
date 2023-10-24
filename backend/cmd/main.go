package main

import (
	"fmt"
	"valbuddy/internals/config"
	"valbuddy/internals/db"
	"valbuddy/internals/routes"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	log "gorm.io/gorm/logger"
)

func main() {
	// Initialize dependencies
	env, err := config.LoadConfig("../.env")
	if err != nil {
		panic("Error loading environment variables")
	}
	validator, database, store, sessions, err := db.NewDatabase(env.DATABASE_URL, log.Warn, env.COOKIE_DOMAIN)
	if err != nil {
		panic("Error creating New DB")
	}
	aws, err := config.NewAWS()
	if err != nil {
		panic("Error creating New AWS")
	}
	a := config.NewApp(validator, database, store, sessions, env, aws)
	// Create A Routes

	// Define Middleware
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     fmt.Sprintf("%s, %s", a.Env.API_URL, a.Env.FRONTEND_URL),
		AllowHeaders:     "*",
		AllowCredentials: true,
	}))
	// Define App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
	routes.User(app, a)
	routes.Auth(app, a)
	if a.Env.IS_LAMBDA {
		// If running as a Lambda function, start the Lambda handler
		lambda.Start(a.Handler)
	} else {
		// If not running as a Lambda function, start the Fiber server
		app.Listen("localhost:3001")
	}
}
