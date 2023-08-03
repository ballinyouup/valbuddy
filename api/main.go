package main

import (
	"context"
	"log"
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

func StartFiber() *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.ConfigDefault))

	// App Routes
	routes.Home(app)
	routes.Login(app)
	return app
}

func init() {
	_, err := config.LoadConfig()
	db.Init()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}
	if config.Env.IS_LAMBDA {
		fiberLambda = fiberadapter.New(StartFiber())
	}
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return fiberLambda.ProxyWithContext(ctx, req)
}

func main() {
	if config.Env.IS_LAMBDA {
		lambda.Start(Handler)
	} else {
		StartFiber().Listen(":3000")
	}
}
