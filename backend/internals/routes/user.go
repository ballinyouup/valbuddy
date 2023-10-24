package routes

import (
	"valbuddy/internals/config"
	"valbuddy/internals/handlers"

	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App, a *config.App) {

	// url/user/account
	user := app.Group("/user")
	user.Get("/", func(c *fiber.Ctx) error { return handlers.GetUserHandler(c, a) })
	user.Post("/update", func(c *fiber.Ctx) error { return handlers.UpdateUserHandler(c, a) })
	user.Delete("/delete", func(c *fiber.Ctx) error { return handlers.DeleteUserHandler(c, a) })

	// url/user/account
	account := user.Group("/account")
	account.Get("/", func(c *fiber.Ctx) error { return handlers.GetAccountHandler(c, a) })
	account.Post("/update", func(c *fiber.Ctx) error { return handlers.UpdateAccountHandler(c, a) })
	account.Delete("/delete", func(c *fiber.Ctx) error { return handlers.DeleteAccountHandler(c, a) })

	// url/user/post
	userPosts := user.Group("/post")
	userPosts.Get("/", func(c *fiber.Ctx) error { return handlers.GetUserPostsHandler(c, a) })
	userPosts.Post("/new", func(c *fiber.Ctx) error { return handlers.CreatePostHandler(c, a) })
	userPosts.Put("/update/:id", func(c *fiber.Ctx) error { return handlers.UpdatePostHandler(c, a) })
	userPosts.Delete("/delete", func(c *fiber.Ctx) error { return handlers.DeletePostHandler(c, a) })

	// url/posts
	posts := app.Group("/posts")
	posts.Get("/duos", func(c *fiber.Ctx) error { return handlers.GetDuosPostsHandler(c, a) })
	posts.Get("/teams", func(c *fiber.Ctx) error { return handlers.GetTeamsPostsHandler(c, a) })
	posts.Get("/scrims", func(c *fiber.Ctx) error { return handlers.GetScrimsPostsHandler(c, a) })
}
