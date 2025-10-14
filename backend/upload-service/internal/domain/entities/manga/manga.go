package entity

import (
	common "github.com/animetest/backend/upload-service/internal/domain/entities/common"
)

const (
	Spanish  = "es"
	English  = "en"
	Japanese = "jp"
	Chinese  = "ch"
)

var ValidLanguages = map[string]bool{
	Spanish:  true,
	English:  true,
	Japanese: true,
	Chinese:  true,
}

func IsValidLanguage(language string) bool {
	_, exist := ValidLanguages[language]
	return exist
}

type Manga struct {
	ID          string
	Author      string `binding:"required"`
	Description description
	Names       map[string]string `binding:"required,dive"`
	tags        []string
	Volumes     []Volume  `binding:"dive"`
	Chapters    []Chapter `binding:"dive"`
	Status      string    `binding:"required"`
	Date        common.DatePersistence
}
