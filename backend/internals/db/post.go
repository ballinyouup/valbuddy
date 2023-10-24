package db

import (
	"encoding/json"
	"fmt"
	"valbuddy/internals/config"

	"github.com/lucsky/cuid"
)

func GetDuosPosts(limit int, a *config.App) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "duos",
	}
	if err := a.Database.Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetTeamsPosts(limit int, a *config.App) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "Teams",
	}
	if err := a.Database.Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetScrimsPosts(limit int, a *config.App) ([]Post, error) {
	var posts []Post
	query := Post{
		Category: "scrims",
	}
	if err := a.Database.Where(query).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching all posts: %w", err)
	}
	return posts, nil
}

func GetUserPosts(id string, limit int, a *config.App) ([]Post, error) {
	var posts []Post
	searchQuery := &Post{
		UserID: id,
	}
	if err := a.Database.Where(searchQuery).Limit(limit).Find(&posts).Error; err != nil {
		return posts, fmt.Errorf("error fetching post: %w", err)
	}
	return posts, nil
}

func CreatePost(UserID string, Text string, Region string, Category string, Amount int, Roles []string, Ranks []string, a *config.App) error {
	//Convert the roles and ranks string[] into JSON
	roles, err := json.Marshal(Roles)
	if err != nil {
		return fmt.Errorf("error marshaling Roles: %w", err)
	}
	ranks, err := json.Marshal(Ranks)
	if err != nil {
		return fmt.Errorf("error marshaling Roles: %w", err)
	}

	var user User
	query := User{
		ID: UserID,
	}
	if err := a.Database.Preload("Account").Preload("Posts").Where(query).First(&user).Error; err != nil {
		return fmt.Errorf("error finding user in create post: %w", err)
	}

	// Fill the post with fields required
	post := Post{
		ID:           cuid.New(),
		UserID:       user.ID,
		Username:     user.Account.Username,
		Image:        user.Account.Image,
		AccountRank:  user.Account.Rank,
		AccountRoles: user.Account.Roles,
		Category:     Category,
		Text:         Text,
		Amount:       Amount,
		Roles:        roles,
		Ranks:        ranks,
		Region:       Region,
	}

	user.Posts = append(user.Posts, post)
	// Create the post into the database
	if err := a.Database.Save(&user).Error; err != nil {
		return fmt.Errorf("error creating post: %w", err)
	}
	return nil
}

func UpdatePost(userID string, postID string, text string, playerAmount int, playerRoles []string, playerRanks []string, a *config.App) error {
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
	if err := a.Database.Model(&Post{}).Where(query).Updates(updates).Error; err != nil {
		return fmt.Errorf("error updating post: %w", err)
	}

	return nil
}

func DeletePost() error {
	return nil
}
