package handlers

import "github.com/gofiber/fiber/v2"
//TODO: Finish Account CRUD Functions
func GetAccount(c *fiber.Ctx) error {
	return c.SendString("Getting User Account")
}

func UpdateAccount(c *fiber.Ctx) error {
	return c.SendString("Updating User Account")
}

func DeleteAccount(c *fiber.Ctx) error {
	return c.SendString("User Account Deleted")
}
