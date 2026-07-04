# Claude Design Prompt — Meta-analysis Academy Course Views

## Goal
Create/update the **Meta-analysis Academy course experience** inside the current app, using the provided screenshots as visual reference. The result should feel consistent with the existing **MetaRank** dark interface, but adapted for a course/video-learning flow.

## Main requirements

### 1. Course video lesson view
Create a course lesson page similar to the first screenshot.

It should include:

- A dark, modern MetaRank-style layout.
- A left sidebar with the lesson list.
- A central video card/player area.
- A lesson title below the video.
- A rating/grade area similar to MetaRank.
- A feedback link area.
- A comment section below the video view.
- A subheading that clearly says users can **apply my application** / submit their application from this area.

The video view should look like a polished course platform, not a generic video embed.

### 2. Course structure / modules view
Create the Meta-analysis Academy course structure view similar to the second screenshot.

Use the following structure:

1. **Módulo de Introdução**
2. **Módulos 1-3: A ideia**
3. **Módulos 4-7: Os dados**
4. **Módulo 8: Estatística**
5. **Módulo 9: Escrita**
6. **Risco de vieses**
7. **Módulo 10: Envio para revista**

Design requirements:

- Make it similar to MetaRank.
- Instead of simple cards only, organize the modules as a **timeline**.
- Each timeline section should represent one module.
- Each module should have a compact grade/progress/list view inspired by MetaRank.
- The layout should feel structured, premium, and easy to navigate.
- Keep the same dark background, subtle grid/dot texture, rounded cards, cyan/purple accents, and muted borders.

### 3. Sidebar behavior
Important navigation rule:

- In the main Meta-analysis Academy sidebar, the item called **Meta-analysis Academy** should redirect to the **Meta-analysis Academy app**, not to the Courses section.
- The **MAA item inside Courses** should represent the videos from the last edition only.

So the navigation distinction should be clear:

- **Meta-analysis Academy sidebar item** = opens the dedicated Meta-analysis Academy app.
- **Courses > MAA** = opens the course/video archive from the last edition.

## Visual direction
Use the screenshots as the primary visual reference.

The desired style is:

- Dark theme.
- MetaRank-like design language.
- Premium SaaS dashboard feel.
- Rounded cards.
- Soft borders.
- Cyan and purple accent colors.
- Large clear headings.
- Compact but readable lesson/module lists.
- Smooth hover states.
- Professional course-platform experience.

## Do not change

- Do not redesign the whole app.
- Do not change unrelated pages.
- Do not remove existing content or navigation unless needed for this specific request.
- Do not break existing routes.
- Do not replace the MetaRank design language with a completely different style.

## Expected output
Implement the new design/views for:

1. The **course lesson video page**.
2. The **course modules/timeline page**.
3. The **navigation behavior distinguishing the Meta-analysis Academy app from the Courses > MAA video archive**.

The final UI should look cohesive with MetaRank and clearly communicate that Meta-analysis Academy has both a dedicated app area and a course-video archive area.
