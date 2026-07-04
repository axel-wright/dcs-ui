#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# DCS Build Script — minify, concatenate, cache-bust
# Usage: ./build.sh [--watch]
# ═══════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
say() { echo -e "${GREEN}[build]${NC} $*"; }
warn() { echo -e "${RED}[build]${NC} $*"; }

VERSION_FILE="build-version.txt"
CSS_SRC="css/dcs-components.css"
CSS_TMP="/tmp/dcs-css-concat-$$.css"
CSS_OUT="css/dcs-components.min.css"
CORE_SRC="css/dcs-core.css"
CORE_OUT="css/dcs-core.min.css"
JS_OUT="js/dcs-components.min.js"
GUIDE_SRC="guide.js"
GUIDE_OUT="js/guide.min.js"

# ── Concatenate CSS from @import order ──────────────────────
concat_css() {
    local master="${1:-$CSS_SRC}"  # source master file with @imports
    local out="${2:-$CSS_TMP}"     # output concatenated file
    say "CSS: concatenating from @import order ($(basename "$master"))"
    > "$out"

    # Parse @import lines from the master file, preserving order
    local count=0
    while IFS= read -r line; do
        # Pass through remote @import url(...) lines verbatim (e.g. Google Fonts)
        if [[ "$line" =~ @import[[:space:]]+url\( ]]; then
            echo "$line" >> "$out"
            continue
        fi
        # Match: @import 'filename.css';
        if [[ "$line" =~ @import[[:space:]]+[\'\"]([^\'\"]+\.css)[\'\"] ]]; then
            local f="css/${BASH_REMATCH[1]}"
            if [ -f "$f" ]; then
                cat "$f" >> "$out"
                echo "" >> "$out"
                count=$((count + 1))
            else
                warn "  missing: $f"
            fi
        fi
    done < "$master"

    say "  $count files concatenated"
}

# ── Minify CSS ──────────────────────────────────────────────
minify_css() {
    local in="$1" out="$2"
    say "CSS: $in → $out"
    python3 -c "
import re, sys
src = sys.stdin.read()
# Strip /* */ comments (single and multi-line)
src = re.sub(r'/\*.*?\*/', '', src, flags=re.DOTALL)
# Collapse whitespace
src = re.sub(r'[ \t]+', ' ', src)
src = re.sub(r'\n\s*\n', '\n', src)
# Remove spaces around structural chars
src = re.sub(r'\s*([{};:,>+~])\s*', r'\1', src)
# Remove trailing semicolons before }
src = re.sub(r';}', '}', src)
# Remove leading/trailing whitespace per line
lines = [l.strip() for l in src.split('\n') if l.strip()]
sys.stdout.write('\n'.join(lines) + '\n')
" < "$in" > "$out"
    local before=$(wc -c < "$in")
    local after=$(wc -c < "$out")
    local pct=$(python3 -c "print(round(($before - $after) * 100 / $before, 1))")
    say "  ${pct}% smaller ($before → $after bytes)"
}

# ── Concatenate JS (no minification — regex minifiers break string literals) ─

# ── Concatenate JS files ────────────────────────────────────
concat_js() {
    say "JS: concatenating dcs-*.js → $JS_OUT"
    local tmp="/tmp/dcs-concat-$$.js"
    > "$tmp"  # truncate

    # Core first
    if [ -f "js/dcs-core.js" ]; then
        cat "js/dcs-core.js" >> "$tmp"
        echo "" >> "$tmp"
    fi

    # All other dcs-*.js (alphabetical, skip core, demo, legacy)
    for f in js/dcs-*.js; do
        case "$f" in
            js/dcs-core.js) continue ;;
            js/dcs-checkboxes-v1.js) continue ;;  # legacy
            js/*.min.js) continue ;;  # skip our own minified output
        esac
        cat "$f" >> "$tmp"
        echo "" >> "$tmp"
    done

    # Concatenate JS into output
    cat "$tmp" > "$JS_OUT"
    rm "$tmp"
    say "  $(wc -l < "$JS_OUT") lines concatenated"
}

# ── Version hash ────────────────────────────────────────────
get_version() {
    if git rev-parse --short HEAD >/dev/null 2>&1; then
        echo "$(date +%Y%m%d)-$(git rev-parse --short HEAD)"
    else
        date +%s
    fi
}

# ── Update HTML references ──────────────────────────────────
bump_html() {
    local version="$1"
    say "Cache-busting HTML with v=$version"

    local files
    files=$(find . -name '*.html' -not -path './.codegraph/*' -not -path './node_modules/*')

    for f in $files; do
        local changed=0
        local tmp="${f}.tmp"

        cp "$f" "$tmp"

        # Replace CSS references: .css → .min.css with version, and update existing .min.css versions
        sed -i -E "
            s|dcs-components\.css(\?v=[^\"']*)?|dcs-components.min.css?v=${version}|g
            s|dcs-components\.min\.css\?v=[^\"']*|dcs-components.min.css?v=${version}|g
            s|dcs-core\.css(\?v=[^\"']*)?|dcs-core.min.css?v=${version}|g
            s|dcs-core\.min\.css\?v=[^\"']*|dcs-core.min.css?v=${version}|g
        " "$tmp"

        # Replace JS references: guide.js → guide.min.js with version, and update existing
        sed -i -E "
            s|guide\.js(\?v=[^\"']*)?|guide.min.js?v=${version}|g
            s|guide\.min\.js\?v=[^\"']*|guide.min.js?v=${version}|g
            s|dcs-components\.min\.js\?v=[^\"']*|dcs-components.min.js?v=${version}|g
        " "$tmp"

        # Replace multiple dcs-*.js with single minified bundle
        # Only if the file references individual dcs-*.js files
        if grep -q 'dcs-core\.js\|dcs-drawer\.js\|dcs-cards\.js\|dcs-header\.js' "$tmp" 2>/dev/null; then
            python3 -c "
import re, sys
html = open('$tmp').read()
# Find all dcs-*.js script tags (but not demo/ ones, those stay separate)
pattern = re.compile(r'<script[^>]*src=\"(js/dcs-[^\"]+\.js)(\?[^\"]*)?\"[^>]*></script>\s*')
# Only replace consecutive dcs-*.js blocks; leave solo refs alone
# Strategy: if 2+ dcs-*.js found, replace the whole set
matches = list(pattern.finditer(html))
if len(matches) >= 2:
    # Remove all dcs-*.js script tags
    html = pattern.sub('', html)
    # Insert the minified bundle after the last removed tag
    # Find a good insertion point — after other script tags, before </head> or </body>
    insert = '<script src=\"js/dcs-components.min.js?v=${version}\"></script>\n'
    # Insert before first remaining script or before </head>
    if '<script' in html:
        html = html.replace('<script', insert + '<script', 1)
    else:
        html = html.replace('</head>', insert + '</head>')
open('$tmp', 'w').write(html)
"
        fi

        # Only write if actually changed
        if ! diff -q "$f" "$tmp" >/dev/null 2>&1; then
            mv "$tmp" "$f"
            say "  ✓ $(echo "$f" | sed 's|^\./||')"
        else
            rm "$tmp"
        fi
    done
}

# ── Watch mode ──────────────────────────────────────────────
watch_mode() {
    say "Watching css/ and js/ for changes..."
    if command -v inotifywait &>/dev/null; then
        while true; do
            inotifywait -q -e modify,create,delete -r css/ js/ --exclude '\.min\.' 2>/dev/null
            sleep 0.3  # debounce
            run_build
        done
    else
        warn "inotifywait not found. Falling back to polling (3s)."
        local last_build=0
        while true; do
            local latest
            latest=$(find css/ js/ -name '*.css' -o -name '*.js' | grep -v '\.min\.' | xargs stat -c %Y 2>/dev/null | sort -rn | head -1)
            if [ "$latest" -gt "$last_build" ] 2>/dev/null; then
                run_build
                last_build="$latest"
            fi
            sleep 3
        done
    fi
}

# ── Main build ──────────────────────────────────────────────
run_build() {
    local version
    version=$(get_version)
    echo "$version" > "$VERSION_FILE"
    say "Version: $version"

    concat_css
    minify_css "$CSS_TMP" "$CSS_OUT"
    rm -f "$CSS_TMP"

    # Core CSS — base layer (tokens, reset, typography, nav)
    concat_css "$CORE_SRC" "$CSS_TMP"
    minify_css "$CSS_TMP" "$CORE_OUT"
    rm -f "$CSS_TMP"
    concat_js
    cat "$GUIDE_SRC" > "$GUIDE_OUT"
    bump_html "$version"

    say "Build complete. ✓"
}

# ── Entrypoint ──────────────────────────────────────────────
case "${1:-}" in
    --watch|-w)
        run_build
        watch_mode
        ;;
    *)
        run_build
        ;;
esac
