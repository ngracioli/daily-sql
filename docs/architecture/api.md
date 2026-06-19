# API Architecture & Design

This page outlines the general guidance for designing and documenting the DailySQL APIs.

## Specifications
For details on request/response payloads, endpoint schemas, sandboxing, and SQL validation, please refer to:
- [API Contract & Schema Specification](file:///home/ngracioli/www/projects/DailySQL/daily-sql/docs/architecture/api-spec.md)
- [Query Execution Sandbox Design](file:///home/ngracioli/www/projects/DailySQL/daily-sql/docs/architecture/execution-sandbox.md)

## Guidance
- **OpenAPI**: Prefer OpenAPI for contract definitions. When updating or creating endpoints, keep specs synchronized in the openapi folder.
- **Client Generation**: Generate client SDKs or API hooks if needed using OpenAPI codegen tools to ensure type safety between frontend and backend.

