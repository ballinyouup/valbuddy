package routes
import (
	"github.com/gofiber/fiber/v2"
	"valbuddy/internals/handlers"
)
func Auth(app *fiber.App)  {
	app.Get("/login/:provider", handlers.HandleLogin)
	app.Get("/login/:provider/callback", handlers.HandleProviderCallback)
	app.Get("/logout", handlers.HandleLogout)
}