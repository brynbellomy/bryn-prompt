package utils

import (
	"os"
	"os/user"
	"strings"
)

func GetPathStr(color bool) (string, error) {
	cwd, err := getCwd()
	if err != nil {
		return "", err
	}

	parts := strings.Split(cwd, string(os.PathSeparator))
	parts = filterStrings(parts, func(x string) bool { return x != "" })

	secondToLastIdx := len(parts) - 2
	for i, part := range parts {
		if i < secondToLastIdx {
			// anything before the final 2 dirs gets shortened to 3 chars
			if len(part) > 3 {
				parts[i] = part[:3]
			}

		} else if i == secondToLastIdx {
			// second to last is dark blue
			if color {
				parts[i] = Bluef(parts[i])
			}
		} else if i == secondToLastIdx+1 {
			// last is bright blue
			if color {
				parts[i] = BlueBoldf(parts[i])
			}
		}
	}

	if color {
		return strings.Join(parts, Bluef(" / ")), nil
	} else {
		return strings.Join(parts, " / "), nil
	}
}

func getCwd() (string, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	home, err := getHomeDir()
	if err != nil {
		return "", err
	}

	return strings.Replace(cwd, home, "~", 1), nil
}

func getHomeDir() (string, error) {
	usr, err := user.Current()
	if err != nil {
		return "", err
	}
	return usr.HomeDir, nil
}

func filterStrings(all []string, validateFn func(thing string) bool) []string {
	filtered := make([]string, 0)
	for _, thing := range all {
		if validateFn(thing) {
			filtered = append(filtered, thing)
		}
	}
	return filtered
}
