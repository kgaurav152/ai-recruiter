"use client";
import { userDetails } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import InterviewDetailContainer from "../../_components/InterviewDetailContainer";
import CandidateList from "../../_components/CandidateList";

type Params = {
  interviewId: string;
};
const InterviewDetail = () => {
  const { interviewId } = useParams() as Partial<Params>;
  const { user } = userDetails();
  const [interviewDetails, setInterviewDetails] = useState<any>(null);

  useEffect(() => {
    user && GetInterviewDetails();
  }, [user]);
  const GetInterviewDetails = async () => {
    const result = await supabase
      .from("Interviews")
      .select(
        `jobPosition,duration,interview_id,jobDescription,type,questionList,created_at,interview-feedback(userEmail,feedback,userName,created_at)`
      )
      .eq("userEmail", user?.email)
      .eq("interview_id", interviewId);

    console.log(result);
    //@ts-ignore
    setInterviewDetails(result?.data[0]);
  };
  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold">Interview Details</h2>
      {interviewDetails && (
        <>
          <InterviewDetailContainer interviewDetails={interviewDetails} />
          {/* @ts-ignore */}
          <CandidateList
            candidateList={interviewDetails["interview-feedback"]}
          />
        </>
      )}
    </div>
  );
};

export default InterviewDetail;
