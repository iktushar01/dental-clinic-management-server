import { Role } from "../lib/prisma-exports";

export const Permission = {
  ADMIN_MANAGE: "admin.manage",
  PATIENT_CREATE: "patient.create",
  PATIENT_READ: "patient.read",
  PATIENT_UPDATE: "patient.update",
  PATIENT_DELETE: "patient.delete",
  PATIENT_READ_SELF: "patient.read.self",
  APPOINTMENT_MANAGE: "appointment.manage",
  BILLING_MANAGE: "billing.manage",
  INVENTORY_MANAGE: "inventory.manage",
  REPORTS_READ: "reports.read",
  CLINIC_SETTINGS_MANAGE: "clinic.settings.manage",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

type RolePermissionMap = Record<Role, PermissionKey[]>;

export const ROLE_PERMISSIONS: RolePermissionMap = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.PATIENT_CREATE,
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.PATIENT_DELETE,
    Permission.APPOINTMENT_MANAGE,
    Permission.BILLING_MANAGE,
    Permission.INVENTORY_MANAGE,
    Permission.REPORTS_READ,
    Permission.CLINIC_SETTINGS_MANAGE,
  ],
  [Role.RECEPTIONIST]: [
    Permission.PATIENT_CREATE,
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_MANAGE,
  ],
  [Role.DENTIST]: [
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.APPOINTMENT_MANAGE,
  ],
  [Role.ASSISTANT]: [Permission.PATIENT_READ, Permission.PATIENT_UPDATE],
  [Role.ACCOUNTANT]: [Permission.BILLING_MANAGE, Permission.REPORTS_READ],
  [Role.PATIENT]: [Permission.PATIENT_READ_SELF],
};

export const hasPermissions = (
  role: Role,
  requiredPermissions: PermissionKey[],
) => {
  const rolePermissions = ROLE_PERMISSIONS[role] ?? [];
  return requiredPermissions.every((permission) =>
    rolePermissions.includes(permission),
  );
};
