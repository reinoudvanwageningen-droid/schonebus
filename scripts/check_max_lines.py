#!/usr/bin/env python3
import argparse
import subprocess
from pathlib import Path


CODE_EXTENSIONS = {".py", ".js", ".jsx"}


def staged_files():
    result = subprocess.run(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
        check=True,
        capture_output=True,
        text=True,
    )
    return [Path(line) for line in result.stdout.splitlines() if line.strip()]


def line_count(path):
    return len(path.read_text(encoding="utf-8").splitlines())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--max", type=int, required=True)
    parser.add_argument("--files", nargs="*")
    parser.add_argument("--staged", action="store_true")
    args = parser.parse_args()

    paths = staged_files() if args.staged else [Path(file_name) for file_name in args.files or []]
    code_paths = [path for path in paths if path.suffix in CODE_EXTENSIONS and path.exists()]

    violations = []
    for path in code_paths:
        count = line_count(path)
        if count > args.max:
            violations.append((path, count))

    if violations:
        for path, count in violations:
            print(f"{path}: {count} lines, max {args.max}")
        raise SystemExit(1)

    checked = ", ".join(str(path) for path in code_paths) or "no matching code files"
    print(f"OK: {checked}")


if __name__ == "__main__":
    main()
