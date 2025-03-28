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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/Logo.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  userType: "employee" | "company";
  onToggleUserType: () => void;
}

export function LoginForm({ userType, onToggleUserType }: LoginFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        userType: userType,
      });
      
      if (userType === "employee") {
        setLocation("/employee/jobs");
      } else {
        setLocation("/company/dashboard");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
            Login First Into Your Account
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      placeholder="Input your registered email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      {...field}
                    />
                  </FormControl>
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
                        placeholder="Input your account password"
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
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                    >
                      Remember Me
                    </label>
                  </div>
                )}
              />
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot Password
            </Link>

            </div>

            <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-6 rounded-lg transition duration-200"
            size="lg"
          >
            Login
          </Button>


            <div className="text-center text-sm text-gray-500 my-4">
              Or login with
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 hover:bg-gray-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 hover:bg-gray-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.88-3.08.45-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.45C2.33 15.85 3.09 8.42 8.62 8.12c1.67.05 2.82 1.14 3.2 1.14.52 0 1.52-1.11 3.45-1.11.66 0 2.8.08 4.12 2.17-3.67 2.14-3.07 6.82.66 9.96zm-3.46-18c.9 0 2.37-.9 2.37-3.08 0-.19-.02-.38-.05-.56-.93.04-2.03.57-2.8 1.76-.41.64-.75 1.45-.65 2.38h.19c.21 0 .6-.14.94-.5z"
                  />
                </svg>
                <span>Apple</span>
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            You're new in here?{" "}
            <Link href="/auth/signup" className="text-black font-medium hover:underline">
              Create Account
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
          <p>
            © 2023 Ahdus Technology. All rights reserved.{" "}
            <Link href="/terms" className="text-black hover:underline">
            Terms & Conditions
          </Link>{" "}
          <Link href="/privacy" className="text-black hover:underline">
            Privacy Policy
          </Link>

          </p>
        </div>
      </div>
    </div>
  );
}
