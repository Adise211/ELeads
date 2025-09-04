import { z } from "zod";
import { ActivityDTO, ActivityType, LeadDTO, LeadStatus, NoteDTO } from "../types/index.js";

export const noteSchema: z.ZodType<NoteDTO> = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export const activitySchema: z.ZodType<ActivityDTO> = z.object({
  type: z.nativeEnum(ActivityType),
  description: z.string().min(1, { message: "Description is required" }),
});

export const leadSchema: z.ZodType<LeadDTO> = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  status: z.nativeEnum(LeadStatus),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, { message: "Country is required" }),
  notes: z.array(noteSchema).optional(),
  activities: z.array(activitySchema).optional(),
  assignedToId: z.string().optional(),
});
