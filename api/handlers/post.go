package handlers

import (
	"fmt"
	"nextjs-go/db"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// TODO: Finish Post CRUD Functions
func GetDuosPosts(c *fiber.Ctx) error {
	// Get the query params /posts?limit=5. if empty, set to 10
	query := c.Query("limit")
	if query == "" {
		query = "10"
	}
	// Convert string to int
	limit, err := strconv.Atoi(query)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error converting limit to int: %s", err))
	}
	// Get the posts and return as JSON
	posts, err := db.GetDuosPosts(limit)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing get posts: %s", err))
	}
	return c.JSON(posts)
}
func GetTeamsPosts(c *fiber.Ctx) error {
	// Get the query params /posts?limit=5. if empty, set to 10
	query := c.Query("limit")
	if query == "" {
		query = "10"
	}
	// Convert string to int
	limit, err := strconv.Atoi(query)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error converting limit to int: %s", err))
	}
	// Get the posts and return as JSON
	posts, err := db.GetTeamsPosts(limit)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error executing get posts: %s", err))
	}
	return c.JSON(posts)
}

func GetScrimsPosts(c *fiber.Ctx) error {
	// Get the query params /posts?limit=5. if empty, set to 10
	query := c.Query("limit")
	if query == "" {
		query = "10"
	}
	// Convert string to int
	limit, err := strconv.Atoi(query)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("error converting limit to int: %s", err))
	}
	// Get the posts and return as JSON
	posts, err := db.GetScrimsPosts(limit)
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
	// Get the query params /posts?limit=5. if empty, set to 10
	query := c.Query("limit")
	if query == "" {
		query = "10"
	}
	// Convert string to int
	limit, err := strconv.Atoi(query)
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
	if err := db.CreatePost(userId, post.Text, post.Region, post.Category, post.Amount, post.Roles, post.Ranks); err != nil {
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
