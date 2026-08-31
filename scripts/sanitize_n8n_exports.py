#!/usr/bin/env python3
"""Create portfolio-safe n8n workflow exports.

The sanitizer removes runtime metadata, pinned execution data, credential
references, and known secret formats while preserving workflow logic.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

SECRET_PATTERNS = (
    (
        re.compile(r"https://hooks\.slack\.com/services/[A-Za-z0-9/_-]+"),
        "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
    ),
    (
        re.compile(r"https://discord(?:app)?\.com/api/webhooks/[A-Za-z0-9/_-]+"),
        "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
    ),
    (re.compile(r"\bsk-[A-Za-z0-9_-]{16,}"), "{{$env.OPENROUTER_API_KEY}}"),
    (
        re.compile(r"(?i)Bearer\s+[A-Za-z0-9._~+/-]{16,}"),
        "Bearer {{$env.API_TOKEN}}",
    ),
    (re.compile(r"\bAIza[A-Za-z0-9_-]{20,}"), "{{$env.GOOGLE_API_KEY}}"),
    (re.compile(r"\bAKIA[A-Z0-9]{16}\b"), "{{$env.AWS_ACCESS_KEY_ID}}"),
)

EMAIL_PATTERN = re.compile(
    r"(?<![\w.-])[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}(?![\w.-])"
)
E164_PATTERN = re.compile(r"(?<!\w)\+\d{8,15}(?!\w)")
AIRTABLE_ID_PATTERN = re.compile(
    r"\b(?!appendAttribution\b)(?:app|tbl)[A-Za-z0-9]{14}\b"
)
GOOGLE_SHEET_URL_PATTERN = re.compile(
    r"https://docs\.google\.com/spreadsheets/d/[A-Za-z0-9_-]+[^\s\"'<>]*"
)

REMOVE_EVERYWHERE = {"credentials", "webhookId", "instanceId", "pinData"}
REMOVE_TOP_LEVEL = {
    "id",
    "versionId",
    "createdAt",
    "updatedAt",
    "meta",
    "pinData",
    "shared",
    "staticData",
}


def sanitize_string(value: str) -> str:
    result = value
    for pattern, replacement in SECRET_PATTERNS:
        result = pattern.sub(replacement, result)
    result = GOOGLE_SHEET_URL_PATTERN.sub(
        "https://docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID", result
    )
    result = AIRTABLE_ID_PATTERN.sub(
        lambda match: "YOUR_AIRTABLE_BASE_ID"
        if match.group(0).startswith("app")
        else "YOUR_AIRTABLE_TABLE_ID",
        result,
    )
    if "{{" not in result and "$env." not in result:
        result = EMAIL_PATTERN.sub("portfolio@example.com", result)
        result = E164_PATTERN.sub("+10000000000", result)
    return result


def sanitize(value: Any, *, top_level: bool = False) -> Any:
    if isinstance(value, dict):
        clean: dict[str, Any] = {}
        for key, child in value.items():
            if key in REMOVE_EVERYWHERE or (top_level and key in REMOVE_TOP_LEVEL):
                continue
            if key == "cachedResultUrl":
                clean[key] = "https://example.com/resource"
                continue
            if key == "cachedResultName" and isinstance(child, str):
                clean[key] = "Portfolio Resource"
                continue
            if key in {"base", "baseId"} and isinstance(child, dict):
                clean[key] = sanitize(child)
                if isinstance(clean[key].get("value"), str):
                    clean[key]["value"] = "YOUR_AIRTABLE_BASE_ID"
                continue
            if key in {"table", "tableId"} and isinstance(child, dict):
                clean[key] = sanitize(child)
                if isinstance(clean[key].get("value"), str):
                    clean[key]["value"] = "YOUR_AIRTABLE_TABLE_ID"
                continue
            if key in {"documentId", "spreadsheetId"} and isinstance(child, dict):
                clean[key] = sanitize(child)
                if isinstance(clean[key].get("value"), str):
                    clean[key]["value"] = "YOUR_GOOGLE_SHEET_ID"
                continue
            if key == "calendarId" and isinstance(child, dict):
                clean[key] = sanitize(child)
                if isinstance(clean[key].get("value"), str):
                    clean[key]["value"] = "YOUR_CALENDAR_ID"
                continue
            clean[key] = sanitize(child)

        # n8n stores HTTP headers as objects with name/value pairs.
        header_name = str(clean.get("name", ""))
        if re.search(
            r"(?i)(authorization|api[-_ ]?key|x-api-key|token|secret)", header_name
        ) and isinstance(clean.get("value"), str):
            if "anthropic" in header_name.lower():
                clean["value"] = "{{$env.ANTHROPIC_API_KEY}}"
            else:
                clean["value"] = "Bearer {{$env.API_TOKEN}}"
        return clean

    if isinstance(value, list):
        return [sanitize(item) for item in value]

    if isinstance(value, str):
        return sanitize_string(value)

    return value


def sanitize_workflow(source: Path, destination: Path) -> None:
    with source.open(encoding="utf-8") as handle:
        workflow = json.load(handle)
    clean = sanitize(workflow, top_level=True)
    clean["active"] = False
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8") as handle:
        json.dump(clean, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    sanitize_workflow(args.source, args.destination)


if __name__ == "__main__":
    main()
