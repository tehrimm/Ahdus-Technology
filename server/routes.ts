import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { User } from "@shared/schema";

// Profile update schema
const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  photo: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for updating user profile
  app.post('/api/users/:id/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Validate the request body
      const validationResult = updateProfileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid data', details: validationResult.error });
      }
      
      const userData = validationResult.data;
      
      // Find the user
      const existingUser = await storage.getUser(userId);
      
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update user profile with specific profile method
      const updatedUser = await storage.updateUserProfile(userId, userData);
      
      // Remove sensitive information before sending back
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        return res.status(200).json(userWithoutPassword);
      } else {
        return res.status(500).json({ error: 'Failed to update user profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API route for getting user profile
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Find the user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Remove sensitive information before sending back
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  const httpServer = createServer(app);

  return httpServer;
}
