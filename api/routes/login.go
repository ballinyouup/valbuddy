package routes
import (
	"github.com/gofiber/fiber/v2"
	"nextjs-go/handlers"
)
func Login(app *fiber.App)  {
	app.Get("/login/:provider", handlers.HandleLogin)
	app.Get("/login/:provider/callback", handlers.HandleProviderCallback)
}