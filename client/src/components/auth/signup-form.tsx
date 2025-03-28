import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/Logo.png";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  userType: "employee" | "company";
  onToggleUserType: () => void;
}

export function SignupForm({ userType, onToggleUserType }: SignupFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create a company-specific schema by merging with the base schema
  const companySignupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    companyName: z.string().min(1, "Company name is required"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(
      userType === "company" 
        ? companySignupSchema
        : signupSchema
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      companyName: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        userType: userType,
        companyName: userType === "company" ? data.companyName : undefined,
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      setLocation("/auth/login");
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-10 text-center">
        <img src={logo} alt="Ahdus Technology Logo" className="h-20 w-auto mx-auto mb-8" />

          <h2 className="text-2xl font-bold text-gray-800">
            Create Your Account
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {userType === "company" && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Last Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with a number and special character
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 mt-0.5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    I agree to the{" "}
                    <Link href="/terms" className="text-black hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-black hover:underline">
                      Privacy Policy
                    </Link>

                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-6 rounded-lg transition duration-200"
            size="lg"
          >
            Create Account
          </Button>

          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-black font-medium hover:underline">
              Login
            </Link>

          </p>

          <div className="mt-4 flex justify-center gap-4">
          <Button
          type="button"
          onClick={() => userType !== "company" && onToggleUserType()}
          className={`px-6 py-2 rounded-full font-medium transition ${
            userType === "company"
              ? "bg-gray-700 text-white hover:bg-gray-800"
              : "bg-gray-300 text-black border border-gray-500 hover:bg-gray-400"
          }`}
        >
          Company
        </Button>
        <Button
          type="button"
          onClick={() => userType !== "employee" && onToggleUserType()}
          className={`px-6 py-2 rounded-full font-medium transition ${
            userType === "employee"
              ? "bg-gray-700 text-white hover:bg-gray-800"
              : "bg-gray-300 text-black border border-gray-500 hover:bg-gray-400"
          }`}
        >
          Employee
        </Button>

          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>© 2023 Ahdus Technology. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
