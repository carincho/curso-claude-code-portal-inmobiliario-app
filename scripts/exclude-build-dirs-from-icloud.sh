#!/usr/bin/env bash
# En macOS, si el proyecto vive bajo una carpeta sincronizada por iCloud Drive
# (p. ej. ~/Desktop con "Desktop & Documents" activado), iCloud intenta
# sincronizar las carpetas de build (.next, .turbo, node_modules) mientras
# Next.js/Turbopack las escribe constantemente. Eso corrompe su caché y causa
# arranques lentos o el error "Failed to open database".
#
# Este script marca esas carpetas para que iCloud las ignore. No hace nada en
# sistemas sin `xattr` (Linux/CI) ni si el proyecto no está sincronizado.
set -e

command -v xattr >/dev/null 2>&1 || exit 0

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DIRS=(
  "$ROOT/node_modules"
  "$ROOT/apps/web/node_modules"
  "$ROOT/apps/web/.next"
  "$ROOT/apps/api/.next"
  "$ROOT/.turbo"
  "$ROOT/apps/web/.turbo"
  "$ROOT/apps/api/.turbo"
  "$ROOT/packages/shared-types/.turbo"
)

for dir in "${DIRS[@]}"; do
  mkdir -p "$dir"
  xattr -w com.apple.fileprovider.ignore#P 1 "$dir" 2>/dev/null || true
done
