package handlers

import (
	"fmt"
	"nextjs-go/db"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// TODO: Finish Post CRUD Functions
func GetPosts(c *fiber.Ctx) error {
	posts, err := db.GetPosts()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing get posts: %s", err))
	}
	return c.JSON(posts)
}

func GetUserPosts(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}

	limit, err := strconv.Atoi(c.Params("limit"))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error converting string %s", err))
	}

	// Retrieve the user ID from the session
	userId := s.Get("user_id").(string)
	posts, err := db.GetUserPosts(userId, limit)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing get posts: %s", err))
	}
	// Return the user data as JSON response
	return c.JSON(posts)
}

type Post struct {
	Username string   `json:"username"`
	Category string   `json:"category"`
	Text     string   `json:"text"`
	Amount   int      `json:"amount"`
	Roles    []string `json:"roles" gorm:"type:json"`
	Ranks    []string `json:"ranks" gorm:"type:json"`
	Region   string   `json:"region"`
}

func CreatePost(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}
	userId := s.Get("user_id").(string)
	var post Post
	if err := c.BodyParser(&post); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error parsing body: %s", err))
	}
	if err := db.CreatePost(userId, post.Text, post.Username, post.Region, post.Category, post.Amount, post.Roles, post.Ranks); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing create posts: %s", err))
	}
	return c.SendStatus(fiber.StatusOK)
}

func UpdatePost(c *fiber.Ctx) error {
	s, err := db.ValidateSession(c)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, fmt.Sprintf("error validating session %s", err))
	}
	userID := s.Get("user_id").(string)
	postID := c.FormValue("PostID")
	playerAmount, err := strconv.Atoi(c.FormValue("PlayerAmount"))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error converting string: %s", err))
	}
	playerRoles := strings.Split(c.FormValue("PlayerRoles"), ",")
	playerRanks := strings.Split(c.FormValue("PlayerRanks"), ",")
	if err := db.UpdatePost(userID, postID, c.FormValue("Text"), playerAmount, playerRoles, playerRanks); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing get posts: %s", err))
	}
	return c.SendStatus(fiber.StatusOK)
}

func DeletePost(c *fiber.Ctx) error {
	return c.SendString("Deleting User Post: 1")
}
