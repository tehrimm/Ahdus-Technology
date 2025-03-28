import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  linkedinUrl?: string;
  location?: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<User>;
}

interface LoginCredentials {
  email: string;
  password: string;
  userType: "employee" | "company";
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  userType: "employee" | "company";
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// User storage key in localStorage
const USER_STORAGE_KEY = "ahdus_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - in a real app, this would make an API call
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would validate against a backend
      // For this demo, we'll create a mock user
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: credentials.email.split('@')[0],
        email: credentials.email,
        password: "hashed-password", // This would never be stored in the client
        firstName: credentials.userType === "employee" ? "John" : "",
        lastName: credentials.userType === "employee" ? "Doe" : "",
        phone: "",
        photo: credentials.userType === "employee" 
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
          : "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=639&q=80",
        userType: credentials.userType,
        companyName: credentials.userType === "company" ? "Ahdus Technology" : null,
        createdAt: new Date(),
      };

      // Store user in state and localStorage
      setUser(mockUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - in a real app, this would make an API call
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would create a user in the backend
      // For this demo, we'll just create a mock user
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: userData.email.split('@')[0],
        email: userData.email,
        password: "hashed-password", // This would never be stored in the client
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        photo: "",
        userType: userData.userType,
        companyName: userData.companyName || null,
        createdAt: new Date(),
      };

      // In a real app, we might auto-login the user, but here we'll just return
      // We don't store it in state to require the user to log in
      return;
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (data: ProfileUpdateData): Promise<User> => {
    if (!user) {
      throw new Error("User must be logged in to update profile");
    }

    setIsLoading(true);
    try {
      // Make the API request to update the profile
      const updatedUser = await apiRequest<User>(`/api/users/${user.id}/profile`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Update the user in state and localStorage
      const updatedFullUser = { 
        ...user, 
        ...updatedUser,
        // Ensure these fields remain as they were if not returned from API
        password: user.password 
      };
      
      setUser(updatedFullUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedFullUser));
      
      return updatedFullUser;
    } catch (error) {
      console.error("Profile update error:", error);
      throw new Error("Failed to update profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
