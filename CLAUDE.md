# CLAUDE.md — metahub-site

Operating context for any Claude Code session in this repo.

> Global rules in `~/.claude/rules/common/` still apply (Windows/PowerShell,
> token economy, auto-push, clarifying-questions). This file only adds what is
> specific to `metahub-site`.

## Purpose

Static version of the MetaHub site, published with GitHub Pages so a redesign
can be tweaked and shared by link. The working page is **Morgado's Home
redesign** (a colleague's single-file mockup), adapted with its assets wired up.

Not a framework app. No Next.js, no build step. The deliverable is
`index.html` + `assets/`, served straight from `main`.

## Single source of truth

`C:\Users\vanio\metahub-site` is the only working copy. It is a clone of
`github.com/vanioljantunes/metahub-site`, and GitHub Pages serves `main` at the
repo root:

    https://vanioljantunes.github.io/metahub-site/

There used to be a second copy at `claudeOS/projects/metahub-site`, plus nine
duplicate/legacy HTML files in this repo. Both are gone. They caused edits to
land in a file nobody was looking at, so a change would appear to do nothing on
the live site. If a copy of this site shows up anywhere else, it is stale —
delete it rather than editing it.

`index.html` is a **bundled** file: its markup and CSS live inside a
`<script type="__bundler/template">` block as an escaped JSON string
(`\n` for newlines, `<\u002Fstyle>` for closing tags). Search for the escaped
form when editing, and keep replacements in that same escaped form.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The edit surface. Inline CSS + a small vanilla-JS block (video player, section-nav tabs, SVG title animation), inside the bundler template. |
| `*.dc.html`, `abstracts_icu.html`, `metawriters.html`, `tutoring_session.html` | Subpages linked from `index.html`. |
| `serve.mjs` | Tiny static server on `:4321`. Needed because relative assets + the YouTube iframe require `http://`, not `file://`. |
| `assets/` | `logo.png` (real, from live site). `hero.png`, `team/rafael.jpeg`, `team/team-photo.png` are **placeholders** — swap real files in at the same paths, no code change. |
| `reference/live-home/` | **Read-only, gitignored.** Snapshot of the live logged-in Home (React-rendered `index.html`, `home.png`, stylesheets). Pull real content/colours/thumbnails from here. Never the edit surface, never pushed. |
| `.design/`, `.claude/` | Local design artifacts and designer skills. Gitignored — they are not part of the published site. |

## Preview loop

```bash
node serve.mjs        # -> http://localhost:4321
```

Use the server, not `file://`. Per global rule, do not relaunch a running dev
server — trust browser refresh.

## Ship loop

Pushing to `main` republishes the site. After a push:

```bash
gh api repos/vanioljantunes/metahub-site/pages/builds/latest --jq '.status'
```

Wait for `built`, then verify the live URL — not just localhost. A green build
is not proof the change is visible; screenshot the published page.

## Design-flow skill pipeline

The 8 designer skills (Julian Oczkowski's
[designer-skills](https://github.com/julianoczkowski/designer-skills)) are
installed under `.claude/skills/`. They encode a real design process so output
is structured, not random. Run a single step by name, or the whole sequence via
`design-flow`.

| # | Step | Skill | Output |
|---|---|---|---|
| 1 | clarify | `grill-me` | interrogation until decisions resolved |
| 2 | document | `design-brief` | `DESIGN_BRIEF.md` (interview + codebase scan) |
| 3 | structure | `information-architecture` | `INFORMATION_ARCHITECTURE.md` (nav, hierarchy, flows) |
| 4 | systematize | `design-tokens` | `tokens.css` / Tailwind config (light + dark) |
| 5 | plan | `brief-to-tasks` | `TASKS.md` (ordered, vertically-sliced checklist) |
| 6 | build | `frontend-design` | built components/pages; iterates back to step 1 |
| 7 | critique | `design-review` | `DESIGN_REVIEW.md` (on request, after build) |
| — | orchestrate | `design-flow` | runs steps 1→7 in order, confirms between each |

Notes:
- Step 6 loops back to 1 to iterate; step 7 runs only on request.
- `design-tokens` and `frontend-design` check what already exists and **extend
  rather than replace** — they will respect `index.html`'s inline CSS, not bulldoze it.
- For this repo's single-file static reality, the heavy steps (IA, tokens,
  tasks) are optional. The common loop is `grill-me` -> `design-brief` ->
  `frontend-design` -> `design-review`.

## Operating rules

1. **One copy, one file.** Edit `index.html` in this clone. Do not fork a second
   copy of the site, and do not split into a framework or add a build step.
2. **Assets swap by path.** To replace a placeholder, drop the real file at the
   same path/filename. No code edit.
3. **`reference/live-home/` is read-only and private.** Source of truth for real
   content; never edit it, never make it the render target, never commit it.
4. **Verify pixels, not code.** Any CSS/render change is proved with a
   screenshot of the served page, then of the published page — not a grep.
5. **Watch `--radius-full`.** It is `50%`, which paints an ellipse on any
   non-square box. Use a px radius for pills and buttons.
