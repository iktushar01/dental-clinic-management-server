# API Standards

## Response Envelope

All API responses should follow:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

## List Query Contract

- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `searchTerm` (optional)
- `sortBy` (default: `createdAt`)
- `sortOrder` (`asc` or `desc`, default: `desc`)

## Validation Rules

- Use module-local Zod schemas.
- Validate request source explicitly (`body`, `query`, `params`).
- Return validation failures with field-level error details.

## Error Rules

- Use `AppError` for domain and access errors.
- Centralize error formatting through global error middleware.
- Avoid leaking sensitive details in auth errors.
