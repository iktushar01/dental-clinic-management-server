import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../generated/prisma";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { Gender, Role, UserStatus } from "../../lib/prisma-exports";
import AppError from "../../errorHelpers/AppError";
import { generatePatientId } from "../../utils/patientId";
import { ICreatePatientPayload, IUpdatePatientPayload } from "./patient.interface";
import { IQueryParams } from "../../interfaces/query.interface";

const patientPublicSelect = {
  id: true,
  patientId: true,
  name: true,
  email: true,
  profilePhoto: true,
  contactNumber: true,
  address: true,
  dateOfBirth: true,
  gender: true,
  bloodGroup: true,
  allergies: true,
  medicalHistory: true,
  emergencyName: true,
  emergencyPhone: true,
  notes: true,
  tags: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

const generateUniquePatientId = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const patientId = generatePatientId();
    const exists = await prisma.patient.findUnique({
      where: { patientId },
      select: { id: true },
    });

    if (!exists) return patientId;
  }

  throw new AppError(
    StatusCodes.CONFLICT,
    "Unable to generate a unique patient ID. Please retry.",
  );
};

const createPatient = async (payload: ICreatePatientPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "A user with this email already exists");
  }

  const { user: authUser } = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      needPasswordChange: false,
    },
  });

  try {
    const patientId = await generateUniquePatientId();

    return await prisma.patient.create({
      data: {
        patientId,
        userId: authUser.id,
        name: payload.name,
        email: payload.email,
        ...(payload.contactNumber ? { contactNumber: payload.contactNumber } : {}),
        ...(payload.address ? { address: payload.address } : {}),
        ...(payload.gender ? { gender: payload.gender } : {}),
        ...(payload.dateOfBirth ? { dateOfBirth: new Date(payload.dateOfBirth) } : {}),
        ...(payload.bloodGroup ? { bloodGroup: payload.bloodGroup } : {}),
        ...(payload.allergies ? { allergies: payload.allergies } : {}),
        ...(payload.medicalHistory ? { medicalHistory: payload.medicalHistory } : {}),
        ...(payload.emergencyName ? { emergencyName: payload.emergencyName } : {}),
        ...(payload.emergencyPhone ? { emergencyPhone: payload.emergencyPhone } : {}),
        ...(payload.notes ? { notes: payload.notes } : {}),
        tags: payload.tags ?? [],
      },
      select: patientPublicSelect,
    });
  } catch (error) {
    await prisma.user.delete({ where: { id: authUser.id } }).catch(() => undefined);
    throw error;
  }
};

const getAllPatients = async (queryParams: IQueryParams) => {
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(queryParams.limit) || 10));
  const searchTerm = typeof queryParams.searchTerm === "string" ? queryParams.searchTerm.trim() : "";
  const sortBy = typeof queryParams.sortBy === "string" ? queryParams.sortBy : "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? "asc" : "desc";

  const where: Prisma.PatientWhereInput = { isDeleted: false };

  if (searchTerm) {
    where.OR = [
      { patientId: { contains: searchTerm, mode: "insensitive" } },
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { contactNumber: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (typeof queryParams.gender === "string") {
    const allowedGenders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
    if (allowedGenders.includes(queryParams.gender as Gender)) {
      where.gender = queryParams.gender as Gender;
    }
  }

  if (typeof queryParams.bloodGroup === "string") {
    where.bloodGroup = queryParams.bloodGroup;
  }

  const [data, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      select: patientPublicSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPatientById = async (id: string) => {
  const patient = await prisma.patient.findFirst({
    where: { id, isDeleted: false },
    select: patientPublicSelect,
  });

  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
  }

  return patient;
};

const updatePatient = async (id: string, payload: IUpdatePatientPayload) => {
  await getPatientById(id);

  const data: Record<string, unknown> = {};
  if (payload.name !== undefined && payload.name !== null) data.name = payload.name;
  if (payload.contactNumber !== undefined) data.contactNumber = payload.contactNumber;
  if (payload.address !== undefined) data.address = payload.address;
  if (payload.gender !== undefined) data.gender = payload.gender;
  if (payload.dateOfBirth !== undefined)
    data.dateOfBirth = payload.dateOfBirth ? new Date(payload.dateOfBirth) : null;
  if (payload.bloodGroup !== undefined) data.bloodGroup = payload.bloodGroup;
  if (payload.allergies !== undefined) data.allergies = payload.allergies;
  if (payload.medicalHistory !== undefined) data.medicalHistory = payload.medicalHistory;
  if (payload.emergencyName !== undefined) data.emergencyName = payload.emergencyName;
  if (payload.emergencyPhone !== undefined) data.emergencyPhone = payload.emergencyPhone;
  if (payload.notes !== undefined) data.notes = payload.notes;
  if (payload.tags !== undefined) data.tags = payload.tags;

  return prisma.patient.update({
    where: { id },
    data,
    select: patientPublicSelect,
  });
};

const deletePatient = async (id: string) => {
  const patient = await getPatientById(id);

  return prisma.$transaction(async (tx) => {
    await tx.patient.update({
      where: { id: patient.id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    await tx.user.update({
      where: { id: patient.userId },
      data: { isDeleted: true, deletedAt: new Date(), status: UserStatus.DELETED },
    });

    await tx.session.deleteMany({ where: { userId: patient.userId } });
    await tx.account.deleteMany({ where: { userId: patient.userId } });

    return { id: patient.id };
  });
};

export const PatientService = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
