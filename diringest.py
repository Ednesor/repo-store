#!/usr/bin/env python3
"""
diringest.py — Convierte un directorio local en un único archivo de texto plano,
listo para usar como contexto en un LLM (estilo GitIngest pero sin git).

Uso:
    python diringest.py                  # directorio actual
    python diringest.py /ruta/al/proyecto
    python diringest.py /ruta --output resultado.txt
"""

import os
import sys
import argparse
from pathlib import Path

# ── Archivos/carpetas ignorados por defecto ────────────────────────────────────
DEFAULT_IGNORE_DIRS = {
    ".git", ".svn", ".hg",
    "__pycache__", ".mypy_cache", ".pytest_cache", ".ruff_cache",
    "node_modules", ".npm", ".yarn",
    "venv", ".venv", "env", ".env",
    "dist", "build", "out", ".next", ".nuxt",
    ".idea", ".vscode",
    "coverage", ".coverage",
}

DEFAULT_IGNORE_FILES = {
    ".DS_Store", "Thumbs.db", "desktop.ini",
    "*.pyc", "*.pyo", "*.pyd",
    "*.class", "*.o", "*.obj", "*.exe", "*.dll", "*.so", "*.dylib",
    "*.zip", "*.tar", "*.gz", "*.rar", "*.7z",
    "*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.ico", "*.svg", "*.webp",
    "*.mp3", "*.mp4", "*.wav", "*.avi", "*.mov",
    "*.pdf", "*.doc", "*.docx", "*.xls", "*.xlsx",
    "*.lock",           # package-lock.json, yarn.lock, Pipfile.lock, etc.
    "*.min.js", "*.min.css",
}

MAX_FILE_SIZE_MB = 1  # archivos más grandes se omiten


# ── Helpers ────────────────────────────────────────────────────────────────────

def load_gitignore(root: Path) -> list[str]:
    """Lee .gitignore del directorio raíz y devuelve los patrones."""
    gitignore = root / ".gitignore"
    if not gitignore.exists():
        return []
    patterns = []
    for line in gitignore.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            patterns.append(line)
    return patterns


def matches_gitignore(path: Path, root: Path, patterns: list[str]) -> bool:
    """Comprobación simple de patrones .gitignore (sin dependencias externas)."""
    rel = path.relative_to(root)
    rel_str = str(rel).replace("\\", "/")
    name = path.name

    for pattern in patterns:
        # Patrón de directorio (termina en /)
        p = pattern.rstrip("/")
        # Coincidencia por nombre
        if _fnmatch(name, p):
            return True
        # Coincidencia por ruta relativa
        if _fnmatch(rel_str, p):
            return True
        # Patrón con slash → relativo a la raíz
        if "/" in p and _fnmatch(rel_str, p.lstrip("/")):
            return True
    return False


def _fnmatch(name: str, pattern: str) -> bool:
    import fnmatch
    return fnmatch.fnmatch(name, pattern)


def matches_default_ignore(path: Path) -> bool:
    import fnmatch
    if path.is_dir():
        return path.name in DEFAULT_IGNORE_DIRS
    for pat in DEFAULT_IGNORE_FILES:
        if fnmatch.fnmatch(path.name, pat):
            return True
    return False


def is_binary(filepath: Path) -> bool:
    """Detecta si un archivo es binario leyendo los primeros 8 KB."""
    try:
        with open(filepath, "rb") as f:
            chunk = f.read(8192)
        return b"\x00" in chunk
    except OSError:
        return True


def collect_files(root: Path, gitignore_patterns: list[str]) -> list[Path]:
    """Recorre el directorio y devuelve los archivos a incluir, ordenados."""
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        current = Path(dirpath)

        # Filtrar subdirectorios in-place para que os.walk no los visite
        dirnames[:] = sorted([
            d for d in dirnames
            if not matches_default_ignore(current / d)
            and not matches_gitignore(current / d, root, gitignore_patterns)
        ])

        for fname in sorted(filenames):
            fpath = current / fname
            if matches_default_ignore(fpath):
                continue
            if matches_gitignore(fpath, root, gitignore_patterns):
                continue
            files.append(fpath)

    return files


# ── Generador principal ────────────────────────────────────────────────────────

def build_tree(root: Path, files: list[Path]) -> str:
    """Genera un árbol de directorios estilo Unix."""
    lines = [str(root.resolve())]
    seen_dirs: set[Path] = set()
    entries: list[tuple[Path, bool]] = []  # (path, is_file)

    for f in files:
        # Agregar directorios intermedios
        for parent in reversed(f.relative_to(root).parents):
            if parent == Path("."):
                continue
            abs_parent = root / parent
            if abs_parent not in seen_dirs:
                seen_dirs.add(abs_parent)
                entries.append((abs_parent, False))
        entries.append((f, True))

    for path, is_file in entries:
        rel = path.relative_to(root)
        depth = len(rel.parts) - 1
        prefix = "    " * depth + ("├── " if is_file else "📁 ")
        lines.append(prefix + path.name)

    return "\n".join(lines)


def ingest(root: Path, output: Path | None = None) -> None:
    print(f"📂 Procesando: {root.resolve()}")

    gitignore_patterns = load_gitignore(root)
    files = collect_files(root, gitignore_patterns)

    sections = []

    # ── Encabezado ──────────────────────────────────────────────────────────
    sections.append(f"{'='*70}")
    sections.append(f"DIRECTORIO: {root.resolve()}")
    sections.append(f"ARCHIVOS INCLUIDOS: {len(files)}")
    sections.append(f"{'='*70}\n")

    # ── Árbol ───────────────────────────────────────────────────────────────
    sections.append("── ESTRUCTURA ──\n")
    sections.append(build_tree(root, files))
    sections.append("")

    # ── Contenido ───────────────────────────────────────────────────────────
    sections.append("\n── CONTENIDO DE ARCHIVOS ──\n")

    skipped = []
    for fpath in files:
        rel = fpath.relative_to(root)
        size_mb = fpath.stat().st_size / (1024 * 1024)

        header = f"\n{'─'*70}\nARCHIVO: {rel}\n{'─'*70}"

        if size_mb > MAX_FILE_SIZE_MB:
            skipped.append(str(rel))
            sections.append(header)
            sections.append(f"[omitido — tamaño {size_mb:.1f} MB supera el límite de {MAX_FILE_SIZE_MB} MB]")
            continue

        if is_binary(fpath):
            skipped.append(str(rel))
            sections.append(header)
            sections.append("[omitido — archivo binario]")
            continue

        try:
            content = fpath.read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            sections.append(header)
            sections.append(f"[error al leer: {e}]")
            continue

        sections.append(header)
        sections.append(content)

    # ── Resumen final ────────────────────────────────────────────────────────
    if skipped:
        sections.append(f"\n{'='*70}")
        sections.append(f"ARCHIVOS OMITIDOS ({len(skipped)}):")
        for s in skipped:
            sections.append(f"  - {s}")

    result = "\n".join(sections)

    # ── Guardar o imprimir ───────────────────────────────────────────────────
    if output is None:
        output = root / "diringest_output.txt"

    output.write_text(result, encoding="utf-8")
    print(f"✅ Listo: {output.resolve()}")
    print(f"   {len(files)} archivos procesados, {len(skipped)} omitidos")
    print(f"   Tamaño del output: {output.stat().st_size / 1024:.1f} KB")


# ── CLI ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Convierte un directorio en un archivo de texto plano para LLMs."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Directorio a procesar (por defecto: directorio actual)",
    )
    parser.add_argument(
        "--output", "-o",
        help="Archivo de salida (por defecto: diringest_output.txt dentro del directorio)",
    )
    args = parser.parse_args()

    root = Path(args.directory).resolve()
    if not root.is_dir():
        print(f"❌ Error: '{root}' no es un directorio válido.")
        sys.exit(1)

    output = Path(args.output).resolve() if args.output else None
    ingest(root, output)


if __name__ == "__main__":
    main()
