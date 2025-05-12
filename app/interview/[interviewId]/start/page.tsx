"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, Mic, Phone, Timer, WebcamIcon } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import AI_RecruiterLogo from "@/assets/images/AI-Recruiter.png";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import WebCam from "react-webcam";

type Params = {
  interviewId: string;
};
const StartInterview = () => {
  //@ts-ignore
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<any>();
  const conversationRef = useRef<any>(null);
  const { interviewId } = useParams() as Partial<Params>;
  const vapiRef = useRef<any>(null);
  const [interviewDuration, setInterviewDuration] = useState(0); // in seconds
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      toast.error("Microphone access is required to start the interview.");
      return false;
    }
  };

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: false,
      });
      // Immediately stop the tracks to release the webcam
      stream.getTracks().forEach((track) => track.stop());
      setIsWebCamEnabled(true);
      return true;
    } catch (error) {
      toast.error("Webcam access is required for video feature");
      return false;
    } finally {
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(
        process.env.NEXT_PUBLIC_VAPI_API_KEY as string
      );
    }

    const handleMessage = (message: any) => {
      // console.log("message", message);
      if (message?.conversation) {
        const convoString = JSON.stringify(message?.conversation);
        // console.log("Conversation String", convoString);
        setConversation(convoString);
      }
    };
    const vapi = vapiRef.current;

    vapi.on("call-start", () => {
      toast.success("Interview started successfully");
      setInterviewDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setInterviewDuration((prev) => prev + 1);
      }, 1000);
    });

    vapi.on("speech-start", () => {
      // console.log("Assistant speech has started");
      setActiveUser(false);
    });
    vapi.on("speech-end", () => {
      // console.log("Assistant speech has ended");
      setActiveUser(true);
    });

    vapi.on("call-end", () => {
      // console.log("Call has ended");
      toast.success("Interview ended successfully");
      if (timerRef.current) clearInterval(timerRef.current);
      GenerateFeedBack();
    });

    vapi.on("message", handleMessage);

    vapi.on("error", (err: any) => {
      console.error("VAPI Error:", err);
      toast.error("Interview failed: " + err.message);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the ticking timer
      }
      vapi.off("message", handleMessage);
      vapi.off("call-start", () => {});
      vapi.off("call-end", () => {});
      vapi.off("speech-start", () => {});
      vapi.off("speech-end", () => {});
      vapi.off("error", () => {});
    };
  }, []);

  useEffect(() => {
    const autoStartInterview = async () => {
      if (!interviewInfo) return;
      const hasPermission = await requestMicPermission();
      const hasCamPermission = await requestWebcamPermission();
      if (hasPermission && hasCamPermission) {
        startInterview();
      }
    };
    autoStartInterview();
  }, [interviewInfo]);

  const startInterview = async () => {
    const vapi = vapiRef.current;
    const questionList =
      interviewInfo?.interviewData?.questionList
        ?.map((item: any) => item.question)
        .join(" Next Question is: ") || "";
    // console.log(questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}? Let's get started!`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI voice assistant conducting interviews.
            Your job is to ask candidates provided interview questions, assess their responses.
            Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
            "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
            Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
            Questions: ${questionList}
            If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
            "Need a hint? Think about how React tracks component updates!"
            Provide brief, encouraging feedback after each answer. Example:
            "Nice! That's a solid answer."
            "Hmm, not quite! Want to try again?"
            Keep the conversation natural and engaging-use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!" After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
            "That was great! You handled some tough questions well. Keep sharpening your skills!"
            End on a positive note:
            "Thanks for chatting! Hope to see you crushing projects soon!"
            Key Guidelines:
            ✅ Be friendly, engaging, and witty
            ✅ Keep responses short and natural, like a real conversation
            ✅ Adapt based on the candidate's confidence level
            .`.trim(),
          },
        ],
      },
    };
    vapi.start(assistantOptions as any);
  };

  const stopInterview = () => {
    const vapi = vapiRef.current;
    vapi.stop();
  };

  const GenerateFeedBack = async () => {
    setLoading(true);
    const result = await axios.post("/api/ai-feedback", {
      conversation: conversationRef.current,
    });
    // console.log("Final Feedback", result);
    const Content = result.data.content;
    const match = Content.match(/```json\s*([\s\S]*?)\s*```/);

    if (!match || match.length < 2) {
      throw new Error("No valid JSON block found in the response.");
    }

    // Step 2: Parse the extracted JSON string
    const jsonString = match[1];
    const parsed = JSON.parse(jsonString);

    const { data, error } = await supabase
      .from("interview-feedback")
      .insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          feedback: parsed,
          interview_id: interviewId,
          recommended: false,
        },
      ])
      .select();
    // console.log("Feedback Inserted", data);
    router.replace(`/interview/${interviewId}/completed`);
    setLoading(false);
  };

  const startMic = () => {};

  return (
    <div className="p-20 lg:px-48 xl:px-50 max-h-screen">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        AI Interview Session Started
        <span className="flex items-center gap-2 text-gray-400">
          <Timer />
          {formatTime(interviewDuration)}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-[rgb(16,23,39)] rounded-md p-10 border border-gray-600 flex  flex-col items-center justify-center gap-2">
          <div className="relative w-[150px] h-[150px]">
            {!activeUser && (
              <span className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-500 opacity-75 animate-ping z-0" />
            )}
            <Image
              src={AI_RecruiterLogo}
              alt="AI Interviewer"
              width={150}
              height={150}
              className="rounded-full object-contain relative z-10"
            />
          </div>
          <h2 className="text-lg font-bold text-zinc-200">AI Recruiter</h2>
        </div>
        {/* <div className="bg-[rgb(16,23,39)] rounded-md p-10 border border-gray-600 flex items-center justify-center">
          <div className="bg-gray-500 rounded-full w-[150px] h-[150px] flex items-center justify-center">
            <div className="relative w-[150px] h-[150px] flex items-center justify-center">
              {activeUser && (
                <span className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-500 opacity-75 animate-ping z-0" />
              )}
              <h2 className="text-lg font-bold text-zinc-200 text-center z-10">
                {interviewInfo?.userName}
              </h2>
            </div>
          </div>
        </div> */}

        {/* Replace the second div with the webcam component */}
        <div className="bg-[rgb(16,23,39)] rounded-md p-4 border border-gray-600 flex flex-col items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {isWebCamEnabled ? (
              <WebCam
                audio={false}
                onUserMedia={() => setIsWebCamEnabled(true)}
                onUserMediaError={() => {
                  setIsWebCamEnabled(false);
                  toast.error("Could not access webcam");
                }}
                className="w-full h-full max-h-[300px] object-cover rounded-md"
                screenshotFormat="image/jpeg"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-800 rounded-md flex items-center justify-center">
                <WebcamIcon className="w-24 h-24 text-gray-500" />
              </div>
            )}
            {/* <Button
              onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}
              className="mt-4"
              variant={isWebCamEnabled ? "destructive" : "default"}
            >
              {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
            </Button> */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 mt-5">
        <Mic
          className="h-12 w-12 bg-gray-500 p-3 rounded-full cursor-pointer"
          onClick={startMic}
        />
        {/* <AlertConfirmation stopInterview={stopInterview}> */}
        {!loading ? (
          <Phone
            className="h-12 w-12 bg-red-500 p-3 rounded-full cursor-pointer"
            onClick={stopInterview}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
        {/* </AlertConfirmation> */}
      </div>
      <h2 className="text-md font-bold mt-5 text-gray-500 text-center">
        Interview for {interviewInfo?.jobPosition} is in progress...
      </h2>
    </div>
  );
};
export default StartInterview;
