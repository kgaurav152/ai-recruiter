import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/AppSidebar";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";
import { FaHamburger } from "react-icons/fa";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full p-10" >
        <SidebarTrigger className="mb-3 bg-blue-600 h-10 w-10 cursor-pointer"/>
        <WelcomeContainer/>
        {children}
        </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
