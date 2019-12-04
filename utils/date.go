package utils

import (
	"fmt"
	"strings"
	"time"
)

func GetDateStr(color bool) (string, error) {
	now := time.Now()

	hr, min := now.Hour(), now.Minute()
	timestampSec := now.UTC().Unix()
	y, m, d := now.Year(), now.Month(), now.Day()

	var rightSegments []string
	if color {
		timeStr := Whitef("%.2d", hr) + Greyf(":") + Whitef("%.2d", min)
		dateStr := Bluef("%d", y) + Greyf(".") + Bluef("%d", m) + Greyf(".") + Bluef("%d", d)
		timestampStr := Greyf("%d", timestampSec)
		rightSegments = append(rightSegments, timeStr, Greyf("."), dateStr, Greyf("."), timestampStr)
	} else {
		timeStr := fmt.Sprintf("%.2d:%.2d", hr, min)
		dateStr := fmt.Sprintf("%d.%d.%d", y, m, d)
		timestampStr := fmt.Sprintf("%d", timestampSec)
		rightSegments = append(rightSegments, timeStr, ".", dateStr, ".", timestampStr)
	}

	return strings.Join(rightSegments, " "), nil
}
