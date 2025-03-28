import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserProfile(id: number, profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    linkedinUrl?: string;
    location?: string;
    photo?: string;
  }): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    // Add the createdAt field
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      photo: insertUser.photo || null,
      companyName: insertUser.companyName || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    
    if (!existingUser) {
      return undefined;
    }

    // Create updated user by merging existing data with new data
    const updatedUser: User = {
      ...existingUser,
      ...userData,
    };

    // Ensure we don't override id and createdAt
    updatedUser.id = existingUser.id;
    updatedUser.createdAt = existingUser.createdAt;

    // Update user in storage
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async updateUserProfile(
    id: number, 
    profileData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      bio?: string;
      linkedinUrl?: string;
      location?: string;
      photo?: string;
    }
  ): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    
    if (!existingUser) {
      return undefined;
    }
    
    // We'll pick only the profile-related fields to update
    // This is more specific than just updating any user field
    const userUpdates: Partial<User> = {
      ...(profileData.firstName !== undefined && { firstName: profileData.firstName }),
      ...(profileData.lastName !== undefined && { lastName: profileData.lastName }),
      ...(profileData.email !== undefined && { email: profileData.email, username: profileData.email.split('@')[0] }),
      ...(profileData.phone !== undefined && { phone: profileData.phone }),
      ...(profileData.photo !== undefined && { photo: profileData.photo }),
    };
    
    // Use the general updateUser method to perform the update
    return this.updateUser(id, userUpdates);
  }
}

export const storage = new MemStorage();
