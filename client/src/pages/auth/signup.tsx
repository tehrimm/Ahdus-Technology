import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const [userType, setUserType] = useState<"employee" | "company">("company");

  const toggleUserType = () => {
    setUserType(userType === "employee" ? "company" : "employee");
  };

  return (
    <AuthLayout>
      <SignupForm userType={userType} onToggleUserType={toggleUserType} />
    </AuthLayout>
  );
}
