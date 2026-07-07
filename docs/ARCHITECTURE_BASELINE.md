# Backend Architecture Baseline

## Module Structure

- `src/app/module/<feature>` owns `*.route.ts`, `*.controller.ts`, `*.service.ts`, `*.validation.ts`, `*.interface.ts`.
- `src/app/routes/index.ts` is the only API route registry.
- `src/app/middleware` contains cross-cutting concerns (auth, permission checks, validation, errors).
- `src/app/shared` contains transport utilities (`catchAsync`, `sendResponse`).
- `src/app/utils` contains reusable technical helpers (cookies, token, query builder).

## Feature First Rules

1. A feature module may only access Prisma through a feature repository/service boundary.
2. Every write endpoint must use Zod validation.
3. Every list endpoint must use the shared list-query contract (`page`, `limit`, `searchTerm`, `sortBy`, `sortOrder`).
4. Every protected endpoint must use `checkAuth` and permission middleware.
5. Use soft delete (`isDeleted`, `deletedAt`) for business entities unless hard delete is explicitly required.

## Required Backend Layers

- `route`: HTTP contract and middleware chain.
- `controller`: HTTP adaptation only (no business logic).
- `service`: business orchestration and transaction boundaries.
- `repository` (incremental adoption): Prisma access and query encapsulation.

## Naming and Response Rules

- Use domain naming (`patient`, `dentist`, `appointment`) instead of legacy academic terms.
- Use `sendResponse` with a consistent envelope: `success`, `message`, `data`, `meta`.
- Prefer `AppError` for business and authorization failures.
