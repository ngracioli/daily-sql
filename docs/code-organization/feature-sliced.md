# Feature-Sliced Architecture

Overview
Feature-Sliced architecture organises code by feature and layer. It improves scalability and team autonomy.

Common layers
- app — application-level composition (layouts, providers)
- pages / router — Next.js routing
- widgets — page-level composed components
- features — self-contained features
- entities — domain models and logic
- shared — reusable libraries and UI primitives

Example structure
- src/
  - app/
  - features/
    - auth/
      - ui/
      - model/
      - api/
  - entities/
  - shared/
