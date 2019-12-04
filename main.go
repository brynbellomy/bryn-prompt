package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/brynbellomy/git2go"

	"github.com/brynbellomy/bryn-prompt/utils"
)

const Reset = "\x1b[0m"

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
		pathStr, err := utils.GetPathStr(false)
		if err != nil {
			return
		}

		dateStr, err := utils.GetDateStr(false)
		if err != nil {
			return
		}

		pathLen = len(pathStr)
		dateLen = len(dateStr)
	}

	pathStr, err := utils.GetPathStr(true)
	if err != nil {
		return
	}

	dateStr, err := utils.GetDateStr(true)
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

	var gitStr string
	branchName, err := gitBranch()
	if err != nil {
		return
	} else if branchName != "" {
		gitStr = utils.Greyf("[") + utils.Redf(branchName) + utils.Greyf("]") + Reset
	}

	unescaped := []byte("\n" + pathStr + spacesStr + dateStr + Reset + "\n" + gitStr + Reset + promptStr + Reset + "\n")

	// We have to escape color characters so that bash knows they're zero-width.  Otherwise scrolling
	// back through command history results in a corrupted prompt.
	escaped := []byte("")
	escapeSeq := false
	for i := 0; i < len(unescaped); i++ {
		if !escapeSeq {
			if unescaped[i] == '\x1b' {
				escapeSeq = true
				escaped = append(escaped, '\x01')
			}

			escaped = append(escaped, unescaped[i])

		} else {
			escaped = append(escaped, unescaped[i])

			if unescaped[i] == 'm' {
				escapeSeq = false
				escaped = append(escaped, '\x02')
			}
		}
	}

	os.Stdout.Write(escaped)
}

func gitBranch() (string, error) {
	gitPath, isRepo := isGitRepo()
	if !isRepo {
		return "", nil
	}

	repo, err := git.OpenRepository(gitPath)
	if err != nil {
		return "", err
	}

	iter, err := repo.NewBranchIterator(git.BranchAll)
	if err != nil {
		return "", err
	}

	for {
		branch, _, err := iter.Next()
		if err != nil {
			return "", err
		}
		is, err := branch.IsCheckedOut()
		if err != nil {
			return "", err
		}
		if is {
			return branch.Name()
		}
	}
}

func isGitRepo() (string, bool) {
	cwd, err := os.Getwd()
	if err != nil {
		return "", false
	}

	parts := strings.Split(cwd, "/")
	for i := len(parts); i >= 0; i-- {
		maybeGitPath := filepath.Join(strings.Join(parts[:i], "/"), ".git")
		_, err = os.Stat(maybeGitPath)
		if err != nil && !errors.Is(err, os.ErrNotExist) {
			return "", false
		} else if err == nil {
			return maybeGitPath, true
		}
	}
	return "", false
}
