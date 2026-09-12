package domain

type ActivityItem struct {
	ID     int64  `json:"id"`
	Title  string `json:"title"`
	Ep     string `json:"ep"`
	Rating int    `json:"rating"`
	Color  string `json:"color"`
	Date   string `json:"date"`
}
