package main

import (
	"context"
	"fmt"
	"sveltekit-go/config"
	"sveltekit-go/db"
	"sveltekit-go/routes"

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

func StartFiber() *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New())

	// App Routes
	routes.Home(app)
	routes.Login(app)
	return app
}

func init() {
	if _, err := config.LoadConfig(); err != nil {
		initError = fmt.Errorf("error loading configuration: %w", err)
	}
	if err := db.Init(); err != nil {
		initError = fmt.Errorf("error initializing database: %w", err)
	}
	if config.Env.IS_LAMBDA {
		fiberLambda = fiberadapter.New(StartFiber())
	}
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if initError != nil {
		return events.APIGatewayProxyResponse{}, fiber.NewError(fiber.StatusInternalServerError, "init > %w", initError.Error())
	}
	return fiberLambda.ProxyWithContext(ctx, req)
}

func main() {
	if config.Env.IS_LAMBDA {
		lambda.Start(Handler)
	} else {
		StartFiber().Listen(":3000")
	}
}
