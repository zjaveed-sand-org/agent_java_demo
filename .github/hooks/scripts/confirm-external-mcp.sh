#!/usr/bin/env bash
# Hook: confirm-external-mcp
# Event: PreToolUse
# Purpose: Require user confirmation before any external MCP server tool is invoked.

# -- Logging setup --
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/confirm-external-mcp.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"; }

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_name', d.get('toolName', '')))
except:
    print('')
" 2>>"$LOG_FILE")

# Only gate tools whose name starts with "mcp_"
if [[ "$TOOL_NAME" != mcp_* ]]; then
  echo '{}'
  exit 0
fi

log "ASK: MCP tool '$TOOL_NAME'"
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "External MCP tool '${TOOL_NAME}' is about to be called. Please confirm this is intended."
  }
}
EOF
exit 0
