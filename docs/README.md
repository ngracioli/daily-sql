# Docs

This folder contains the project's documentation: architecture decisions, component guidance, code organisation, contributor guides and references.

Purpose
- Single entry point for repository documentation.
- Make it easy for contributors to find architecture, component rules, and how-to guidance.

Quick Links
- Architecture: ./architecture/README.md
- Components: ./components/README.md
- Code organization: ./code-organization/README.md
- Guides: ./guides/README.md
- Style guide: ./style-guide/README.md
- Contributing: ./contributing/README.md
- Diagrams: ./diagrams/README.md
- Reference: ./reference/README.md
- Appendices: ./appendices/README.md

Conventions
- Markdown only. Use kebab-case for filenames (example: `feature-sliced.md`).
- Each folder should have a `README.md` that explains purpose and links to its files.
- Put diagrams and images in `docs/diagrams/` and reference them by relative path.

How to add docs
1. Create or update a targeted file under `docs/`.
2. Add or update the containing folder `README.md` with a short entry.
3. Add a short entry to `docs/SUMMARY.md` if you want the page in the TOC.

Maintainership
- Leave a note at the top of files you author with your name and date if you want a visible owner.
