package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/brynbellomy/bryn-prompt/utils"
	"github.com/fatih/color"
)

var Resetf = color.New(color.Reset).SprintfFunc()

func getScreenSize() (cols uint64, rows uint64, err error) {
	if len(os.Args) < 2 {
		err = fmt.Errorf("Must specify columns and rows via the first argument: `bryn-prompt COLS,ROWS`")
		return
	}

	arg := os.Args[1]
	parts := strings.Split(arg, ",")
	if len(parts) != 2 {
		err = fmt.Errorf("Badly formatted COLS,ROWS argument")
		return
	}

	cols, err = strconv.ParseUint(parts[0], 10, 64)
	if err != nil {
		return
	}

	rows, err = strconv.ParseUint(parts[1], 10, 64)
	return
}

func main() {
	var err error
	defer func() {
		if err != nil {
			panic(err)
		}
	}()

	var pathLen, dateLen int
	{
		color.NoColor = true

		pathStr, err := utils.GetPathStr()
		if err != nil {
			return
		}

		dateStr, err := utils.GetDateStr()
		if err != nil {
			return
		}

		pathLen = len(pathStr)
		dateLen = len(dateStr)

		color.NoColor = false
	}

	pathStr, err := utils.GetPathStr()
	if err != nil {
		return
	}

	dateStr, err := utils.GetDateStr()
	if err != nil {
		return
	}

	cols, _, err := getScreenSize()
	if err != nil {
		return
	}

	need := int(cols) - (pathLen + dateLen)
	spacesStr := strings.Repeat(" ", need)

	var promptStr = utils.Yellowf(" λ ")
	os.Stdout.WriteString("\n" + pathStr + spacesStr + dateStr + Resetf("") + "\n" + promptStr + Resetf("") + "\n")
}
