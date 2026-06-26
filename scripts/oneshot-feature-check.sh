#!/usr/bin/env bash
set -euo pipefail

mode="${1:---full}"

usage() {
  cat <<'USAGE'
Usage: scripts/oneshot-feature-check.sh [--quick|--full]

--quick  Run typecheck and lint.
--full   Run typecheck, lint, and build. This is the default.
USAGE
}

case "$mode" in
  --quick | --full)
    ;;
  -h | --help)
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

run() {
  printf '
==> %s
' "$*"
  "$@"
}

run npm run typecheck
run npm run lint

if [[ "$mode" == "--full" ]]; then
  run npm run build
fi
