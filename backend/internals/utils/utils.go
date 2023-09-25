package utils

import (
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)
func Title(text string) string {
	return cases.Title(language.AmericanEnglish).String(text)
}