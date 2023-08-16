package main

import (
	"context"
	"fmt"
	"nextjs-go/config"
	"nextjs-go/db"
	"nextjs-go/routes"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	fiberadapter "github.com/awslabs/aws-lambda-go-api-proxy/fiber"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

var fiberLambda *fiberadapter.FiberLambda
var initError error

// StartFiber initializes and configures the Fiber application.
func StartFiber() *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     fmt.Sprintf("%s, %s, %s", config.Env.API_URL, config.Env.FRONTEND_URL, "http://localhost:3000"),
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	// App Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome!")
	})
	routes.User(app)
	routes.Auth(app)
	return app
}

func init() {
	// Load configuration and initialize the database
	if _, err := config.LoadConfig(); err != nil {
		initError = fmt.Errorf("error loading configuration: %w", err)
	}
	if err := db.Init(); err != nil {
		initError = fmt.Errorf("error initializing database: %w", err)
	}

	// If running as a Lambda function, create a Fiber adapter
	if config.Env.IS_LAMBDA {
		fiberLambda = fiberadapter.New(StartFiber())
	}
}

// Handler handles incoming API Gateway Proxy requests.
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if initError != nil {
		// Return an error response if initialization encountered an error
		return events.APIGatewayProxyResponse{}, fiber.NewError(fiber.StatusInternalServerError, "Init: %w", initError.Error())
	}
	return fiberLambda.ProxyWithContext(ctx, req)
}

func main() {
	if config.Env.IS_LAMBDA {
		// If running as a Lambda function, start the Lambda handler
		lambda.Start(Handler)
	} else {
		// If not running as a Lambda function, start the Fiber server
		StartFiber().Listen("localhost:3001")
	}
}