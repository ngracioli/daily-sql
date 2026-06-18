# How To Add A Component

Steps
1. Create component folder under `src/shared/ui/<component-name>`.
2. Add `index.tsx`, `styles.module.css`, `README.md` with usage examples and prop docs.
3. Add tests in the same folder (`<component>.test.tsx`).
4. Export component from `src/shared/ui/index.ts` if it's part of the public UI surface.
5. Update `docs/components/ui-library.md` with the component entry.
