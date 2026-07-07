import { Gender } from "../../lib/prisma-exports";

export interface ICreatePatientPayload {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  notes?: string;
  tags?: string[];
}

export interface IUpdatePatientPayload {
  name?: string;
  contactNumber?: string | null;
  address?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  notes?: string | null;
  tags?: string[];
}
