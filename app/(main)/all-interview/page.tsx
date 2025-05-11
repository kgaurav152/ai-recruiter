"use client";
import { userDetails } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InterviewCard from "../dashboard/_components/InterviewCard";

const AllInterview = () => {
  const [interviewsList, setInterviewsList] = useState<any[]>([]);
  // @ts-ignore
  const { user } = userDetails();

  useEffect(() => {
    GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    let { data: Interview, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("created_at", { ascending: false });
    // @ts-ignore
    setInterviewsList(Interview);
  };

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl">Previously Created Interviews</h2>
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
            <InterviewCard key={interview.interview_id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllInterview;
