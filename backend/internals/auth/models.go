package auth

type OAuth2Config interface {
	FormatAuthURL() string
	GetAccessToken(code string) (interface{}, error)
	GetUserInfo(tokenResponse interface{}) (interface{}, error)
}

type DiscordOAuth2Config struct {
	AuthorizeURL   string
	ResponseType   string
	ClientID       string
	Scope          string
	State          string
	RedirectURI    string
	Prompt         string
	AccessTokenURL string
	UserInfoURL    string
}

type DiscordResponse struct {
	Status       int    `json:"status"`
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type DiscordUserResponse struct {
	Status           int    `json:"status"`
	ID               string `json:"id"`
	Username         string `json:"username"`
	Discriminator    string `json:"discriminator"`
	GlobalName       string `json:"global_name,omitempty"`
	Avatar           string `json:"avatar,omitempty"`
	Bot              bool   `json:"bot,omitempty"`
	System           bool   `json:"system,omitempty"`
	MFAEnabled       bool   `json:"mfa_enabled,omitempty"`
	Banner           string `json:"banner,omitempty"`
	AccentColor      int    `json:"accent_color,omitempty"`
	Locale           string `json:"locale,omitempty"`
	Verified         bool   `json:"verified,omitempty"`
	Email            string `json:"email,omitempty"`
	Flags            int    `json:"flags,omitempty"`
	PremiumType      int    `json:"premium_type,omitempty"`
	PublicFlags      int    `json:"public_flags,omitempty"`
	AvatarDecoration string `json:"avatar_decoration,omitempty"`
}

type TwitchResponse struct {
	Status       int    `json:"status"`
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type TwitchUserResponse struct {
	Status int `json:"status"`
	Data   []struct {
		ID              string `json:"id"`
		Login           string `json:"login"`
		DisplayName     string `json:"display_name"`
		Type            string `json:"type"`
		BroadcasterType string `json:"broadcaster_type"`
		Description     string `json:"description"`
		ProfileImageURL string `json:"profile_image_url"`
		OfflineImageURL string `json:"offline_image_url"`
		ViewCount       int    `json:"view_count"`
		Email           string `json:"email"`
		CreatedAt       string `json:"created_at"`
	} `json:"data"`
}

type TwitchOAuth2Config struct {
	AuthorizeURL   string
	ResponseType   string
	ClientID       string
	Scope          string
	State          string
	RedirectURI    string
	ForceVerify    string
	AccessTokenURL string
	UserInfoURL    string
}
