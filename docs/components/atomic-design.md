# Atomic Design Mapping

We use Atomic Design to organise shared UI primitives.

Folders
- shared/ui/atoms — smallest building blocks (Button, Icon, Input)
- shared/ui/molecules — combinations of atoms (InputWithLabel, CardHeader)
- shared/ui/organisms — larger, reusable sections (Navbar, Modal)
- widgets/ & features/ — compose organisms into pages and flows

Export rules
- Barrel export from `shared/ui/index.ts` to provide a single public surface for UI primitives.
