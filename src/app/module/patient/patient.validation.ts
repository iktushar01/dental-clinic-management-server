import z from "zod";
import { Gender } from "../../lib/prisma-exports";
import { listQueryZodSchema } from "../../validators/query.validation";

const phoneRegex = /^\+?[0-9\s\-()]+$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const optionalNullableTrimmedString = z.preprocess(
  (value) => {
    if (value === null) return null;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  },
  z.string().trim().nullable().optional(),
);

export const createPatientZodSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6).max(20),
  contactNumber: z.string().regex(phoneRegex).min(7).max(20).optional(),
  address: z.string().trim().min(3).max(200).optional(),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z.string().regex(isoDateRegex, "Date of birth must be YYYY-MM-DD").optional(),
  bloodGroup: z.string().trim().min(2).max(8).optional(),
  allergies: z.string().trim().max(500).optional(),
  medicalHistory: z.string().trim().max(2000).optional(),
  emergencyName: z.string().trim().min(2).max(80).optional(),
  emergencyPhone: z.string().regex(phoneRegex).min(7).max(20).optional(),
  notes: z.string().trim().max(2000).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).optional(),
});

export const updatePatientZodSchema = z
  .object({
    name: optionalNullableTrimmedString.pipe(z.string().min(2).max(80).nullable().optional()),
    contactNumber: optionalNullableTrimmedString.pipe(
      z.string().regex(phoneRegex).min(7).max(20).nullable().optional(),
    ),
    address: optionalNullableTrimmedString.pipe(z.string().min(3).max(200).nullable().optional()),
    gender: z.preprocess(
      (value) => {
        if (value === null) return null;
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed === "" ? null : trimmed;
      },
      z.nativeEnum(Gender).nullable().optional(),
    ),
    dateOfBirth: optionalNullableTrimmedString.pipe(
      z.string().regex(isoDateRegex, "Date of birth must be YYYY-MM-DD").nullable().optional(),
    ),
    bloodGroup: optionalNullableTrimmedString.pipe(z.string().min(2).max(8).nullable().optional()),
    allergies: optionalNullableTrimmedString.pipe(z.string().max(500).nullable().optional()),
    medicalHistory: optionalNullableTrimmedString.pipe(z.string().max(2000).nullable().optional()),
    emergencyName: optionalNullableTrimmedString.pipe(z.string().min(2).max(80).nullable().optional()),
    emergencyPhone: optionalNullableTrimmedString.pipe(
      z.string().regex(phoneRegex).min(7).max(20).nullable().optional(),
    ),
    notes: optionalNullableTrimmedString.pipe(z.string().max(2000).nullable().optional()),
    tags: z.array(z.string().trim().min(1).max(30)).max(20).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const patientListQueryZodSchema = listQueryZodSchema.extend({
  gender: z.nativeEnum(Gender).optional(),
  bloodGroup: z.string().trim().optional(),
});
