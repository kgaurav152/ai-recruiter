import React from "react";
import DashboardProvider from "./provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardProvider>
        <div>{children}</div>
      </DashboardProvider>
    </div>
  );
};

export default DashboardLayout;
