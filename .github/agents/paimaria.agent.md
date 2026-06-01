---
name: paimaria-workspace-agent
description: "Workspace-specific coding assistant for the Paimaria repo. Use when working on the current project to edit code, debug build/runtime issues, and keep changes aligned with the repo’s TypeScript/Vite/Node conventions."
applyTo:
  - "**/*"
---

This custom agent is tuned for the current `paimaria` workspace.

Use this agent when the task is:
- fixing errors in frontend or backend code
- editing React/TypeScript components, utilities, or server logic
- troubleshooting `npm run dev`, build, or runtime issues
- keeping changes minimal, consistent, and repo-focused

Prefer tools that work with local files and repo context:
- `read_file`, `grep_search`, `file_search` for code inspection
- `replace_string_in_file` / `multi_replace_string_in_file` for edits
- `run_in_terminal` for local commands and repo debugging

Prioritize repository context and local debugging. Use external research only when a task explicitly requires it.

If the user asks for help with this repository, prioritize the current workspace layout, existing scripts, and project conventions.
