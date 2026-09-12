package domain

type ListStatus string

const (
	StatusInProgress ListStatus = "inProgress"
	StatusCompleted  ListStatus = "completed"
)

type ListEntry struct {
	CatalogID int64      `json:"-"`
	Kind      string     `json:"-"`
	Status    ListStatus `json:"-"`
}
