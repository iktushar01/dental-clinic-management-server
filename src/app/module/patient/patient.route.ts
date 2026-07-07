import { Router } from "express";
import { Role } from "../../lib/prisma-exports";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { checkPermission } from "../../middleware/checkPermission";
import { Permission } from "../../constants/permissions";
import { PatientController } from "./patient.controller";
import {
  createPatientZodSchema,
  patientListQueryZodSchema,
  updatePatientZodSchema,
} from "./patient.validation";

const router: Router = Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST),
  checkPermission(Permission.PATIENT_CREATE),
  validateRequest(createPatientZodSchema),
  PatientController.createPatient,
);

router.get(
  "/",
  checkAuth(
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.RECEPTIONIST,
    Role.DENTIST,
    Role.ASSISTANT,
    Role.ACCOUNTANT,
  ),
  checkPermission(Permission.PATIENT_READ),
  validateRequest(patientListQueryZodSchema, "query"),
  PatientController.getAllPatients,
);

router.get(
  "/:id",
  checkAuth(
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.RECEPTIONIST,
    Role.DENTIST,
    Role.ASSISTANT,
    Role.ACCOUNTANT,
  ),
  checkPermission(Permission.PATIENT_READ),
  PatientController.getPatientById,
);

router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.DENTIST, Role.ASSISTANT),
  checkPermission(Permission.PATIENT_UPDATE),
  validateRequest(updatePatientZodSchema),
  PatientController.updatePatient,
);

router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  checkPermission(Permission.PATIENT_DELETE),
  PatientController.deletePatient,
);

export const PatientRoutes: Router = router;
