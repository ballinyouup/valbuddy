package routes

import (
	"nextjs-go/handlers"
	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App) {
	user := app.Group("/user")
	user.Get("/", handlers.GetUser)
	user.Post("/update", handlers.UpdateUser)
	user.Delete("/delete", handlers.DeleteUser)

	// url/user/account
	account := user.Group("/account")
	account.Get("/", handlers.GetAccount)
	account.Post("/update", handlers.UpdateAccount)
	account.Delete("/delete", handlers.DeleteAccount)

	// url/user/post
	post := user.Group("/post")
	post.Get("/", handlers.GetPost)
	post.Post("/new", handlers.CreatePost)
	post.Put("/update/:id", handlers.UpdatePost)
	post.Delete("/delete", handlers.DeletePost)

	// Get All Posts route
	app.Get("/posts", handlers.GetPosts)
}


