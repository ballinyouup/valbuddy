package main

import (
	"context"
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

func init() {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.ConfigDefault))
	// App Routes
	routes.Home(app)
	routes.Login(app)
	fiberLambda = fiberadapter.New(app)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return fiberLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
