# RBAC Matrix

## Roles

- `SUPER_ADMIN`
- `ADMIN`
- `RECEPTIONIST`
- `DENTIST`
- `ASSISTANT`
- `ACCOUNTANT`
- `PATIENT`

## Permission Keys

- `admin.manage`
- `patient.create`
- `patient.read`
- `patient.update`
- `patient.delete`
- `patient.read.self`
- `appointment.manage`
- `billing.manage`
- `inventory.manage`
- `reports.read`
- `clinic.settings.manage`

## Role to Permission Mapping

- `SUPER_ADMIN`: all permissions.
- `ADMIN`: operational management without super-admin administration.
- `RECEPTIONIST`: patient read/create/update + appointment operations.
- `DENTIST`: patient read + own patient updates + clinical operations.
- `ASSISTANT`: patient read + limited clinical support operations.
- `ACCOUNTANT`: billing/report permissions.
- `PATIENT`: self-read only (`patient.read.self`).

## Enforcement

- Authentication uses `checkAuth(...roles)` for role gate.
- Fine-grained authorization uses `checkPermission(...permissions)` with centralized map in `src/app/constants/permissions.ts`.
