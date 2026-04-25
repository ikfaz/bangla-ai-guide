#!/usr/bin/env bash
# scripts/check-redirects.sh
# Traces the full redirect chain for each legacy URL.
#
# Output format:
#   ✅  URL → 301 → URL → 200
#   ❌  URL → 302 → URL → 200  (302 found; should be 301)
#   ❌  URL → 301 → URL → 301 → URL → 200  (2 hops; chain too long)
#
# Usage: bash scripts/check-redirects.sh

URLS=(
  "https://banglaaiguide.com/index.html"
  "https://banglaaiguide.com/tool-detail.html?tool=stable-diffusion"
  "https://banglaaiguide.com/tool-detail.html?tool=huggingchat"
  "https://banglaaiguide.com/tool-detail.html?tool=meta-ai"
  "https://banglaaiguide.com/deepseek/privacy.html"
  "https://banglaaiguide.com/elevenlabs/privacy.html"
  "https://banglaaiguide.com/elevenlabs-bangla-voice/privacy.html"
  "https://banglaaiguide.com/terms/privacy/"
  "https://www.banglaaiguide.com/"
  "https://banglaaiguide.com/ai-tools-bangladesh-bengali.html"
)

pass=0
fail=0

trace_url() {
  local url="$1"
  local chain="$url"
  local current="$url"
  local hops=0
  local bad_status=""
  local final_status=""

  while true; do
    local raw status location

    raw=$(curl -s -I -m 15 -A "redirect-checker/1.0" "$current" 2>/dev/null)
    if [[ -z "$raw" ]]; then
      chain="$chain → [no response]"
      bad_status="curl returned nothing (server unreachable?)"
      break
    fi

    # Last HTTP status line (handles HTTP/2 and HTTP/1.1)
    status=$(printf '%s' "$raw" | grep -i '^HTTP' | tail -1 | awk '{print $2}')
    location=$(printf '%s' "$raw" | grep -i '^location:' | tail -1 \
                 | sed 's/^[Ll]ocation:[[:space:]]*//' | tr -d '\r\n')

    if [[ "$status" =~ ^3 ]]; then
      hops=$((hops + 1))
      chain="$chain → $status → $location"

      if [[ "$status" != "301" ]]; then
        bad_status="$status found; should be 301"
      fi

      if [[ -z "$location" ]]; then
        bad_status="no Location header on $status response"
        break
      fi

      # Resolve a relative Location (e.g. /path/) against the current host
      if [[ "$location" == /* ]]; then
        local origin
        origin=$(printf '%s' "$current" | grep -oE '^https?://[^/]+')
        location="${origin}${location}"
      fi

      current="$location"

      if (( hops >= 10 )); then
        bad_status="redirect loop (≥10 hops)"
        break
      fi
    else
      final_status="$status"
      chain="$chain → $status"
      break
    fi
  done

  # Evaluate result
  local verdict reason
  if [[ -n "$bad_status" ]]; then
    verdict="❌"
    reason="$bad_status"
  elif [[ "$final_status" != "200" ]]; then
    verdict="❌"
    reason="final status $final_status (expected 200)"
  elif (( hops > 1 )); then
    verdict="❌"
    reason="${hops} hops — chain too long (should be 1)"
  elif (( hops == 0 )); then
    verdict="❌"
    reason="no redirect occurred (expected a redirect)"
  else
    verdict="✅"
    reason=""
  fi

  if [[ "$verdict" == "✅" ]]; then
    printf "✅  %s\n" "$chain"
    pass=$((pass + 1))
  else
    printf "❌  %s  (%s)\n" "$chain" "$reason"
    fail=$((fail + 1))
  fi
}

echo "=== Redirect chain audit — $(date '+%Y-%m-%d %H:%M %Z') ==="
echo

for u in "${URLS[@]}"; do
  trace_url "$u"
done

echo
printf "Result: %d ✅   %d ❌\n" "$pass" "$fail"

if (( fail > 0 )); then
  exit 1
fi
