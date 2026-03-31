#!/usr/bin/env bash
# Hook: block-dangerous-commands
# Event: PreToolUse
# Purpose: Deny destructive system/project commands; require confirmation for risky ones.

# -- Logging setup --
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/block-dangerous-commands.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"; }

# Read all stdin
INPUT="$(cat)"

# Parse tool_name and command in one python3 call
PARSED=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    name = d.get('tool_name', d.get('toolName', ''))
    ti = d.get('tool_input', d.get('toolInput', {}))
    cmd = ''
    if isinstance(ti, dict):
        cmd = ti.get('command', ti.get('input', ti.get('cmd', '')))
    print(name)
    print(cmd)
except Exception as e:
    print('')
    print('')
    print(str(e), file=sys.stderr)
" 2>>"$LOG_FILE")

TOOL_NAME=$(echo "$PARSED" | head -n1)
COMMAND=$(echo "$PARSED" | tail -n +2 | head -n1)

# Only inspect terminal-execution tools
if [[ "$TOOL_NAME" != "run_in_terminal" ]]; then
  echo '{}'
  exit 0
fi

if [[ -z "$COMMAND" ]]; then
  echo '{}'
  exit 0
fi

# -- Patterns that are ALWAYS blocked (deny) --
DENY_PATTERNS=(
  'rm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*(\s+--)?\s+/'
  'rm\s+-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*(\s+--)?\s+/'
  'rm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*(\s+--)?\s+\*'
  'rm\s+-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*(\s+--)?\s+\*'
  'rm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*(\s+--)?\s+~'
  'mkfs\.'
  'dd\s+if='
  '>\s*/dev/[sh]d'
  'chmod\s+-R\s+777\s+/'
  ':\(\)\s*\{\s*:\|:\s*&\s*\}\s*;'
  'curl\s.*\|\s*(ba)?sh'
  'wget\s.*\|\s*(ba)?sh'
  'curl\s.*\|\s*sudo'
  'wget\s.*\|\s*sudo'
  'sudo\s+rm\s+'
  'shutdown'
  'reboot'
  'init\s+[06]'
  'mv\s+/\s'
  '>\s*/etc/'
)

for pat in "${DENY_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qEi "$pat"; then
    log "DENIED: '$COMMAND' (pattern: $pat)"
    echo "BLOCKED: command '$COMMAND' matches dangerous pattern. This could harm your project or system." >&2
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked: command matches dangerous pattern ($pat). This could harm your project or system."
  }
}
EOF
    exit 2
  fi
done

# -- Patterns that require user confirmation (ask) --
ASK_PATTERNS=(
  'git\s+push\s+.*--force'
  'git\s+push\s+.*-f\b'
  'git\s+reset\s+--hard'
  'git\s+clean\s+-[a-zA-Z]*f'
  'drop\s+(table|database|schema|index)'
  'truncate\s+table'
  'delete\s+from\s+\S+\s*;?\s*$'
  'rm\s+-[a-zA-Z]*r'
  'npm\s+publish'
  'npx\s+-y\s+'
  '--no-verify'
  'git\s+push'
  'docker\s+system\s+prune'
  'docker\s+rm\s+-f'
  'kubectl\s+delete'
  'terraform\s+destroy'
  'pip\s+install'
)

for pat in "${ASK_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qEi -- "$pat"; then
    log "ASK: '$COMMAND' (pattern: $pat)"
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "Risky command detected (matches: $pat). Please confirm before proceeding."
  }
}
EOF
    exit 0
  fi
done

# -- Allow everything else --
log "ALLOWED: '$COMMAND'"
echo '{}'
exit 0
