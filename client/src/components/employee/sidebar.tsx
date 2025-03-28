import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/Logo.png";
import {
  Briefcase,
  FileCheck,
  User,
  Settings,
  Sun,
  Moon,
  LogOut
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isMobile?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const SidebarItem = ({
  href,
  icon,
  children,
  isMobile = false,
  isActive = false,
  className,
  onClick,
}: SidebarItemProps) => {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    if (onClick) onClick();
    setLocation(href);
  };
  
  return (
    <div
      className={cn(
        "group flex items-center px-4 py-3 text-sm font-medium cursor-pointer",
        isActive
          ? "bg-primary-light border-l-2 border-primary text-primary"
          : "text-gray-700 hover:bg-gray-50 hover:border-l-2 hover:border-primary hover:text-primary",
        isMobile ? "text-base" : "",
        className
      )}
      onClick={handleClick}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </div>
  );
};

export function Sidebar({ className, isMobile = false, onItemClick }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    if (onItemClick) {
      onItemClick();
    }
    // Redirect to login page after logout
    setLocation("/auth/login");
  };

  const setLightMode = () => {
    setIsDarkMode(false);
    // In a real app, you would apply light mode styles to the entire app
  };
  
  const setDarkMode = () => {
    setIsDarkMode(true);
    // In a real app, you would apply dark mode styles to the entire app
  };

  return (
    <aside className={cn("w-48 bg-white h-screen overflow-y-auto flex-shrink-0 flex flex-col relative", className)}>
      <div className="px-4 py-6">
        <div onClick={() => {
          handleItemClick();
          setLocation("/employee/jobs");
        }} className="cursor-pointer">
          <img src={logo} alt="Ahdus Technology Logo" className="h-20 w-auto mx-auto mb-8 object-cover" />

        </div>
      </div>

      <div className="mt-4 flex-1">
        <SidebarItem
          href="/employee/jobs"
          icon={<Briefcase className="h-5 w-5" />}
          isActive={location === "/employee/jobs"}
          isMobile={isMobile}
          onClick={handleItemClick}
        >
          Jobs
        </SidebarItem>
        
        <SidebarItem
          href="/employee/applications"
          icon={<FileCheck className="h-5 w-5" />}
          isActive={location === "/employee/applications"}
          isMobile={isMobile}
          onClick={handleItemClick}
        >
          Applications
        </SidebarItem>
        
        <SidebarItem
          href="/employee/profile"
          icon={<User className="h-5 w-5" />}
          isActive={location === "/employee/profile"}
          isMobile={isMobile}
          onClick={handleItemClick}
        >
          Profile
        </SidebarItem>
        
        <SidebarItem
          href="/employee/settings"
          icon={<Settings className="h-5 w-5" />}
          isActive={location === "/employee/settings"}
          isMobile={isMobile}
          onClick={handleItemClick}
        >
          Settings
        </SidebarItem>
      </div>

      <div className="p-4 flex space-x-2 justify-start absolute bottom-0">
        <button 
          onClick={setLightMode}
          className={cn(
            "py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center",
            !isDarkMode 
              ? "bg-primary text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </button>

        <button
          onClick={setDarkMode}
          className={cn(
            "py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center",
            isDarkMode 
              ? "bg-primary text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </button>
      </div>
    </aside>
  );
}