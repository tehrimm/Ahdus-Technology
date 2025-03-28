import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const [userType, setUserType] = useState<"employee" | "company">("company");

  const toggleUserType = () => {
    setUserType(userType === "employee" ? "company" : "employee");
  };

  return (
    <AuthLayout
      // title="Let's empower your employees today"
      // subtitle="We help to complete all your conveyancing needs easily"
    >
      <LoginForm userType={userType} onToggleUserType={toggleUserType} />
    </AuthLayout>
  );
}
