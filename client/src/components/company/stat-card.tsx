import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatCard({ title, value, change, icon, iconBgColor = "bg-primary bg-opacity-10" }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-full p-3", iconBgColor)}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div 
                    className={cn(
                      "ml-2 flex items-baseline text-sm font-semibold",
                      change.isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {change.isPositive ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {change.isPositive ? "Increased" : "Decreased"} by
                    </span>
                    {change.value}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
