import React, { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/employee/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useSearch } from "@/lib/search-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();

  // Only handle the jobs search on the jobs page
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // If not on the jobs page, navigate to it
    if (!location.startsWith("/employee/jobs")) {
      setLocation("/employee/jobs");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50">
          <div className="absolute inset-0 flex">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <Sidebar isMobile={true} onItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="flex-shrink-0 w-14"></div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left side - Mobile menu button & Greeting */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Greeting */}
              {/* <div className="flex flex-col ml-3">
                <h1 className="text-xl font-bold text-gray-800">Hello {user?.firstName || "User"} 👋</h1>
                <p className="text-sm text-gray-500">Good Morning</p>
              </div> */}
            </div>
            
            {/* Center - Search Bar */}
            <div className="hidden lg:flex items-center relative ml-10 flex-1 max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Search jobs" 
                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !location.startsWith("/employee/jobs")) {
                      setLocation("/employee/jobs");
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Right side - User Menu */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div 
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-800">
                      {/* {user?.firstName} {user?.lastName} */}
                    </div>
                    <div className="text-xs text-gray-500">Job Seeker</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a
                      href="/employee/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setProfileDropdownOpen(false);
                        setLocation("/employee/profile");
                      }}
                    >
                      Profile
                    </a>
                    <a
                      href="/employee/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setProfileDropdownOpen(false);
                        setLocation("/employee/settings");
                      }}
                    >
                      Settings
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <a
                      href="/auth/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setProfileDropdownOpen(false);
                        // Use setLocation to navigate
                        setLocation("/auth/login");
                      }}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
