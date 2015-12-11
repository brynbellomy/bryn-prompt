package utils

import "github.com/fatih/color"

var (
	Whitef    = color.New(color.FgWhite).SprintfFunc()
	Yellowf   = color.New(color.FgYellow).SprintfFunc()
	Bluef     = color.New(color.FgBlue).SprintfFunc()
	BlueBoldf = color.New(color.FgBlue, color.Bold).SprintfFunc()
	Greyf     = color.New(color.Faint).SprintfFunc()
)
