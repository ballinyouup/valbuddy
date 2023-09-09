package routes

import (
	"nextjs-go/handlers"

	"github.com/gofiber/fiber/v2"
)

func User(app *fiber.App) {
	
	// url/user/account
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
	userPosts := user.Group("/post")
	userPosts.Get("/", handlers.GetUserPosts)
	userPosts.Post("/new", handlers.CreatePost)
	userPosts.Put("/update/:id", handlers.UpdatePost)
	userPosts.Delete("/delete", handlers.DeletePost)

	// url/posts
	posts := app.Group("/posts")
	posts.Get("/duos", handlers.GetDuosPosts)
	posts.Get("/teams", handlers.GetTeamsPosts)
	posts.Get("/scrims", handlers.GetScrimsPosts)
}
