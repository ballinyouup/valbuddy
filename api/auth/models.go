package auth

type DiscordLinks struct {
	AccessTokenURL string
	AuthorizeURL   string
	RedirectURI    string
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
	Status           int     `json:"status"`
	ID               string  `json:"id"`
	Username         string  `json:"username"`
	Discriminator    string  `json:"discriminator"`
	GlobalName       string  `json:"global_name,omitempty"`
	Avatar           string  `json:"avatar,omitempty"`
	Bot              bool    `json:"bot,omitempty"`
	System           bool    `json:"system,omitempty"`
	MFAEnabled       bool    `json:"mfa_enabled,omitempty"`
	Banner           string  `json:"banner,omitempty"`
	AccentColor      *int    `json:"accent_color,omitempty"`
	Locale           string  `json:"locale,omitempty"`
	Verified         bool    `json:"verified,omitempty"`
	Email            *string `json:"email,omitempty"`
	Flags            *int    `json:"flags,omitempty"`
	PremiumType      *int    `json:"premium_type,omitempty"`
	PublicFlags      *int    `json:"public_flags,omitempty"`
	AvatarDecoration string  `json:"avatar_decoration,omitempty"`
}

