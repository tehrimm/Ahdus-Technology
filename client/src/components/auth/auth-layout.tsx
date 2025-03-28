import React from "react";
import HeroImage from "@/assets/Hero.png"; // Ensure the correct path

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="login-container w-full md:w-1/2 bg-neutral-900 text-white p-8 md:p-16 flex flex-col justify-end min-h-[300px] md:min-h-screen"
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl opacity-80 mb-10">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
