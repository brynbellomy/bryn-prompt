package utils

import (
	"strings"
	"time"
)

func GetDateStr() (string, error) {
	now := time.Now()

	hr, min := now.Hour(), now.Minute()
	timestampSec := now.UTC().Unix()
	y, m, d := now.Year(), now.Month(), now.Day()

	timeStr := Whitef("%.2d", hr) + Greyf(":") + Whitef("%.2d", min)
	dateStr := Bluef("%d", y) + Greyf(".") + Bluef("%d", m) + Greyf(".") + Bluef("%d", d)
	timestampStr := Greyf("%d", timestampSec)

	rightSegments := make([]string, 0)
	rightSegments = append(rightSegments, timeStr, Greyf("."), dateStr, Greyf("."), timestampStr)

	return strings.Join(rightSegments, " "), nil
}
