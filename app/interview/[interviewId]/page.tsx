"use client";
import Image from "next/image";
import logo from "@/assets/images/Recruitron.png";
import jobInterview from "@/assets/images/job-interview.jpg";
import { Clock, Info, Loader2Icon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";
interface interviewDataType {
  jobPosition: string;
  jobDescription: string;
  duration: string;
  type: string;
}

type Params = {
  interviewId: string;
};
const Interview = () => {
  const { interviewId } = useParams() as Partial<Params>;
  const [interviewData, setInterviewData] =
    useState<interviewDataType | null>();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  //@ts-ignore
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();
  useEffect(() => {
    interviewId && GetInterviewDetails();
  }, [interviewId]);
  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: Interview, error } = await supabase
        .from("Interviews")
        .select("jobPosition,jobDescription,duration,type")
        .eq("interview_id", interviewId);
      // @ts-ignore
      setInterviewData(Interview[0]);
      setLoading(false);
      if (Interview?.length === 0) {
        toast.error("Incorrect Interview Link");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Incorrect Interview Link");
    }
  };

  const onJoinInterview = async () => {
    setLoading(true);
    let { data: Interview, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("interview_id", interviewId);
    setInterviewInfo({
      userName,
      userEmail,
      // @ts-ignore
      interviewData: Interview[0],
    });
    router.push(`/interview/${interviewId}/start`);
    setLoading(false);
  };
  return (
    <div className="px-10 md:px-24 lg:px-32 xl:px-44 mt-20">
      <div className="w-full flex flex-col items-center justify-center border rounded-2xl px-20 py-10 bg-[rgb(16,23,39)]">
        <Image src={logo} alt="Recruitron" className="w-[240px] h-[140px]" />
        <h2 className=" text-2xl font-bold">AI-Powered Interview Platform</h2>
        <Image
          src={jobInterview}
          alt="Interview"
          className="w-[250px] my-5"
          height={500}
        />

        <h2 className="text-xl font-bold">{interviewData?.jobPosition}</h2>
        <h2 className="flex items-center gap-2 text-gray-400 mt-2">
          <Clock /> {interviewData?.duration}
        </h2>
        <div className="w-full flex flex-col gap-2">
          <h2>Enter Your Full Name:</h2>
          <Input
            type="text"
            placeholder="e.g. John Doe"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <h2>Enter Your Email:</h2>
          <Input
            type="text"
            placeholder="e.g. xHl0Y@example.com"
            onChange={(e) => setUserEmail(e.target.value)}
            value={userEmail}
          />
        </div>

        <div className="bg-[rgba(255,255,255,0.1)] rounded-md p-5 w-full text-blue-500 mt-3">
          <h2 className="flex items-center gap-2">
            <Info /> Before you begin
          </h2>
          <ul className="list-disc list-inside">
            <li>Make sure you have a stable internet connection</li>
            <li>Find a quiet and comfortable environment</li>
          </ul>
        </div>

        <div className="w-full">
          <Button
            className="mt-5 w-full cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold"
            disabled={loading || !userName || !interviewData}
            onClick={onJoinInterview}
          >
            <Video /> {loading && <Loader2Icon />} Join Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
