package handlers

import "github.com/gofiber/fiber/v2"

func GetPosts(c *fiber.Ctx) error {
	return c.SendString("Getting All Posts")
}

func GetPost(c *fiber.Ctx) error {
	return c.SendString("Getting User Post: 1")
}

func CreatePost(c *fiber.Ctx) error {
	return c.SendString("Created User Post: 1")
}

func UpdatePost(c *fiber.Ctx) error {
	return c.SendString("Updating User Post: 1")
}

func DeletePost(c *fiber.Ctx) error {
	return c.SendString("Deleting User Post: 1")
}
