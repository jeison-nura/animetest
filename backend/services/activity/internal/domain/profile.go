package domain

type ProfileStat struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Icon  string `json:"icon"`
}

type GenreAffinity struct {
	Genre string `json:"genre"`
	Pct   int    `json:"pct"`
	Color string `json:"color"`
}

type Achievement struct {
	Label string `json:"label"`
	Desc  string `json:"desc"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

type UserSettings struct {
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	Language    string `json:"language"`
	Country     string `json:"country"`
}
