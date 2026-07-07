import z from "zod";

export const listQueryZodSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type ListQueryInput = z.infer<typeof listQueryZodSchema>;
