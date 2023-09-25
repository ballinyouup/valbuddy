package routes
import (
	"github.com/gofiber/fiber/v2"
	"valbuddy/internals/handlers"
)
func Auth(app *fiber.App)  {
	
	app.Get("/login/:provider", func(c *fiber.Ctx) error {
		return handlers.HandleLogin(c, false)
	})
	app.Get("/login/:provider/callback", func(c *fiber.Ctx) error {
		return handlers.HandleProviderCallback(c, false)
	})
	app.Get("/logout", handlers.HandleLogout)
}