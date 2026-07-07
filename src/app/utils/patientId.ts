const PATIENT_ID_PREFIX = "PAT";

export const generatePatientId = () => {
  const timestamp = Date.now().toString().slice(-8);
  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${PATIENT_ID_PREFIX}-${timestamp}${randomPart}`;
};
