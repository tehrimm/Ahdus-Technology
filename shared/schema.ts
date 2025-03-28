import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (for both employees and companies)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  photo: text("photo"),
  userType: text("user_type").notNull(), // 'employee' or 'company'
  companyName: text("company_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  companyId: integer("company_id").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  jobType: text("job_type").notNull(), // 'full-time', 'part-time', 'contract', 'remote', 'hybrid'
  requirements: text("requirements"),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
});

// Job applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  resumeUrl: text("resume_url").notNull(),
  photoUrl: text("photo_url"),
  coverLetter: text("cover_letter"),
  germanProficiency: text("german_proficiency").notNull(),
  visaStatus: text("visa_status").notNull(),
  linkedinUrl: text("linkedin_url"),
  // New fields for AI matching
  preferredLocation: text("preferred_location"),
  preferredJobType: text("preferred_job_type"), // 'full-time', 'part-time', 'contract', 'remote', 'hybrid'
  canJoinImmediately: boolean("can_join_immediately").default(false),
  noticePeriod: text("notice_period"), // e.g., '2 weeks', '1 month', '3 months'
  experience: integer("experience"), // in years
  education: text("education"), // 'High School', 'Bachelor', 'Master', 'PhD'
  skills: text("skills"), // comma-separated skills
  status: text("status").default("pending").notNull(), // 'pending', 'reviewing', 'accepted', 'rejected'
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

// Departments table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyId: integer("company_id").notNull(),
  description: text("description"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  status: true
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
