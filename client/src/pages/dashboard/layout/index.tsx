import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppHeader from "./app-header";

type MenuItemLink = {
  label: string;
  href: string;
  icon?: string;
};

interface DashboardLayoutProps {
  menuItems: [MenuItemLink, ...MenuItemLink[]];
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
}) => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <main className="flex flex-col w-full">
      <AppHeader />
      <div className="flex w-full">
        {/* Sidebar */}

        <div className="w-[250px] h-full overflow-auto flex flex-col gap-y-3 p-2 items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex flex-col gap-y-3">
            {menuItems.map(({ href, label, icon }, i) => (
              <div key={i} className="flex">
                {icon && <img src={icon} alt={label} className="w-5 h-5" />}
                <Link to={href} className="text-sm font-medium text-gray-600">
                  {label}
                </Link>
                {isActive(href) && (
                  <div className="w-1 h-1 bg-[#C71949] rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
};

export default DashboardLayout;
