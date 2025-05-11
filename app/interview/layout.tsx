"use client";
import React, { useState } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
const InterviewLayout = ({ children }: { children: React.ReactNode }) => {
  const [interviewInfo, setInterviewInfo] = useState({});
  return (
    <div>
      <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo}}>{children}</InterviewDataContext.Provider>
    </div>
  );
};

export default InterviewLayout;
