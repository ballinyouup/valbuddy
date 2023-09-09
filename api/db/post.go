package db

import (
	"encoding/json"
	"fmt"

	"github.com/lucsky/cuid"
)

func GetDuosPosts(limit int) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "duos",
	}
	if err := GetDatabase().Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetTeamsPosts(limit int) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "Teams",
	}
	if err := GetDatabase().Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetScrimsPosts(limit int) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "scrims",
	}
	if err := GetDatabase().Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetUserPosts(id string, limit int) ([]Post, error) {
	var posts []Post
	searchQuery := &Post{
		UserID: id,
	}
	if err := GetDatabase().Where(searchQuery).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching post: %w", err)
	}
	return posts, nil
}

func CreatePost(UserID string, Text string, Username string, Region string, Category string, PlayerAmount int, PlayerRoles []string, PlayerRanks []string) error {
	//Convert the roles and ranks string[] into JSON
	roles, err := json.Marshal(PlayerRoles)
	if err != nil {
		return fmt.Errorf("error marshaling PlayerRoles: %w", err)
	}
	ranks, err := json.Marshal(PlayerRanks)
	if err != nil {
		return fmt.Errorf("error marshaling PlayerRoles: %w", err)
	}

	// Get the user with UserID and return only the image field
	var image string
	query := &User{
		ID: UserID,
	}
	if err := GetDatabase().Model(&User{}).Where(query).Pluck("image", &image).Error; err != nil {
		return fmt.Errorf("error finding user in create post: %w", err)
	}

	// Fill the post with fields required
	post := &Post{
		ID:          cuid.New(),
		UserID:      UserID,
		Username:    Username,
		Image:       image,
		Category:    Category,
		Text:        Text,
		Players:     PlayerAmount,
		PlayerRoles: roles,
		PlayerRanks: ranks,
		Region:      Region,
	}

	// Create the post into the database
	if err := GetDatabase().Create(post).Error; err != nil {
		return fmt.Errorf("error creating post: %w", err)
	}
	return nil
}

func UpdatePost(userID string, postID string, text string, playerAmount int, playerRoles []string, playerRanks []string) error {
	// Create a map to store the fields you want to update
	updates := map[string]interface{}{
		"Text":        text,
		"Players":     playerAmount,
		"PlayerRoles": playerRoles,
		"PlayerRanks": playerRanks,
	}

	query := &Post{
		ID:     postID,
		UserID: userID,
	}
	// Update the post with the given ID
	if err := GetDatabase().Model(&Post{}).Where(query).Updates(updates).Error; err != nil {
		return fmt.Errorf("error updating post: %w", err)
	}

	return nil
}

func DeletePost() error {
	return nil
}
