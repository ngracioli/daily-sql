# Data Model

This page outlines important domain models and where to find them in the repo.

Guidelines
- Place domain types and models under `src/entities/<entity>/`.
- Keep serialization and persistence logic close to the entity when it is specific; otherwise place adapters under `src/shared/adapters`.

Example
- src/entities/user/
  - model.ts (types and constructors)
  - repository.ts (persistence adapter)
  - service.ts (domain operations)
