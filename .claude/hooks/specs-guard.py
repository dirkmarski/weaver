#!/usr/bin/env python3
"""PreToolUse hook: only the product manager writes to specs/. Every other agent reads it.

File tools (Edit, Write, MultiEdit, NotebookEdit) are blocked outright. Bash is
best-effort: redirects, common file verbs, in-place edits and git restores that name
a path under specs/. A command that writes there without naming it gets through.
Relative paths follow any `cd` in the command; after a `cd` the hook cannot resolve
(a shell variable), only absolute paths are judged.
"""
import json
import os
import re
import shlex
import sys

FILE_TOOLS = ("Edit", "Write", "MultiEdit", "NotebookEdit")
WRITE_VERBS = {"rm", "rmdir", "mv", "touch", "truncate", "mkdir", "ln", "chmod",
               "tee", "install", "unlink", "dd"}
INPLACE_VERBS = {"sed", "perl", "gsed"}
GIT_WRITES = {"rm", "mv", "checkout", "restore", "apply", "am", "reset"}

event = json.load(sys.stdin)
if event.get("agent_type") == "product-manager":
    sys.exit(0)

root = os.path.realpath(os.environ.get("CLAUDE_PROJECT_DIR") or event.get("cwd") or ".")
cwd = event.get("cwd") or root
specs = os.path.join(root, "specs")


def in_specs(path, base):
    if not path:
        return False
    path = os.path.expandvars(os.path.expanduser(path))
    if "$" in path or "`" in path:
        return False
    if not os.path.isabs(path):
        if base is None:
            return False
        path = os.path.join(base, path)
    full = os.path.realpath(path)
    return full == specs or full.startswith(specs + os.sep)


def change_dir(base, prev, args):
    if not args:
        return os.path.expanduser("~")
    if args[0] == "-":
        return prev
    target = os.path.expandvars(os.path.expanduser(args[0]))
    if "$" in target or "`" in target:
        return None
    if os.path.isabs(target):
        return os.path.realpath(target)
    return os.path.realpath(os.path.join(base, target)) if base is not None else None


def bash_writes_specs(command):
    base = prev = cwd
    for part in re.split(r"&&|\|\||[;|\n]", command):
        for target in re.findall(r"\d*>>?\|?\s*([^\s;&|<>]+)", part):
            if in_specs(target.strip("'\""), base):
                return True
        try:
            words = shlex.split(part)
        except ValueError:
            words = part.split()
        while words and ("=" in words[0] or words[0] in ("sudo", "command", "env")):
            words = words[1:]
        if not words:
            continue
        verb, args = os.path.basename(words[0]), words[1:]
        if verb in ("cd", "pushd"):
            base, prev = change_dir(base, prev, [a for a in args if not a.startswith("-") or a == "-"]), base
            continue
        paths = [a for a in args if not a.startswith("-")]
        if verb in WRITE_VERBS and any(in_specs(a, base) for a in paths):
            return True
        if verb == "cp" and paths and in_specs(paths[-1], base):
            return True
        if verb in INPLACE_VERBS and any(re.match(r"-[^-]*i|--in-place", a) for a in args) \
                and any(in_specs(a, base) for a in paths):
            return True
        if verb == "git" and args and args[0] in GIT_WRITES and any(in_specs(a, base) for a in paths):
            return True
    return False


tool = event.get("tool_name")
tool_input = event.get("tool_input") or {}
if tool in FILE_TOOLS:
    blocked = in_specs(tool_input.get("file_path") or tool_input.get("notebook_path"), cwd)
elif tool == "Bash":
    blocked = bash_writes_specs(tool_input.get("command", ""))
else:
    blocked = False

if blocked:
    print("Only the product manager writes to specs/. Other agents can read it.", file=sys.stderr)
    sys.exit(2)
