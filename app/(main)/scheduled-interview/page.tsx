"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userDetails } from "@/app/provider";
import { Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "../dashboard/_components/InterviewCard";
const ScheduledInterview = () => {
  const { user } = userDetails();
  const [interviewsList, setInterviewsList] = useState<any[]>([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    const result = await supabase
      .from("Interview")
      .select("jobPosition,duration,interview_id,interview-feedback(userEmail)")
      .eq("userEmail", user?.email)
      .order("created_at", { ascending: false });
    console.log(result);
    //@ts-ignore
    setInterviewsList(result?.data);
  };
  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold">Interview List With Candidate Feedback</h2>
      {interviewsList.length === 0 && (
        <div className="p-5 flex flex-col items-center gap-3 bg-[rgb(16,23,39)] rounded-md mt-5">
          <Video className="h-10 w-10 text-blue-600" />
          <h2 className="text-md">You have not created any interviews</h2>
          <Link href="/dashboard/create-interview">
            <Button className="cursor-pointer">+ Create New Interview</Button>
          </Link>
        </div>
      )}
      {interviewsList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {interviewsList.map((interview) => (
            <InterviewCard key={interview.interview_id} interview={interview} 
                viewDetails={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterview;
