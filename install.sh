#!/usr/bin/env bash
# Install the Foundry skills into DeepSeek Harness.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$HERE/skills"
DEST="${DSH_SKILLS:-$HOME/.dsh/skills}"

[[ -d "$SRC" ]] || { echo "no skills/ next to install.sh" >&2; exit 1; }
mkdir -p "$DEST"

ok=0
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  file="$dir/SKILL.md"
  [[ -f "$file" ]] || { echo "SKIP $name: no SKILL.md" >&2; continue; }

  # frontmatter must open with --- and carry name + description
  head -1 "$file" | grep -q '^---$' || { echo "FAIL $name: no frontmatter" >&2; exit 1; }
  fm_name="$(awk 'NR>1 && /^---$/{exit} NR>1 && /^name:/{sub(/^name:[[:space:]]*/,""); print}' "$file")"
  [[ "$fm_name" == "$name" ]] || { echo "FAIL $name: frontmatter name '$fm_name'" >&2; exit 1; }
  grep -q '^description:' "$file" || { echo "FAIL $name: no description" >&2; exit 1; }

  rm -rf "${DEST:?}/$name"
  cp -a "$dir" "$DEST/$name"
  echo "installed $name"
  ok=$((ok + 1))
done

echo "---"
echo "$ok skills installed in $DEST"
ls "$DEST" | grep -E '^(product-foundry|foundry-)' || true
