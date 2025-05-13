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
  const [micAllowed, setMicAllowed] = useState(false);
  const [camAllowed, setCamAllowed] = useState(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const webcamRef = useRef<WebCam>(null);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

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

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicAllowed(true);
      return true;
    } catch (error) {
      toast.error("Microphone access is required to start the interview.");
      setMicAllowed(false);
      setShowPermissionRequest(true);
      return false;
    }
  };

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCamAllowed(true);
      setIsWebCamEnabled(true);
      return true;
    } catch (error) {
      toast.error("Webcam access is required for video feature");
      setCamAllowed(false);
      setShowPermissionRequest(true);
      return false;
    }
  };

  const requestAllPermissions = async () => {
    setShowPermissionRequest(false);
    const micSuccess = await requestMicPermission();
    const camSuccess = await requestWebcamPermission();

    if (micSuccess && camSuccess) {
      startInterview();
    }
  };

  useEffect(() => {
    const autoStartInterview = async () => {
      if (!interviewInfo) return;
      const hasPermission = await requestMicPermission();
      const hasCamPermission = await requestWebcamPermission();

      if (hasPermission && hasCamPermission) {
        startInterview();
      } else {
        setShowPermissionRequest(true);
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
    <div className="p-4 lg:px-8 xl:px-10 max-h-screen flex flex-col">
      <h2 className="text-2xl font-bold flex justify-between items-center mb-6">
        AI Interview Session Started
        <span className="flex items-center gap-2 text-gray-400">
          <Timer />
          {formatTime(interviewDuration)}
        </span>
      </h2>

      {/* Main Video Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Centered Webcam Container */}
        <div className="relative w-full max-w-4xl h-[70vh] bg-[rgb(16,23,39)] rounded-md border border-gray-600 mx-auto">
          {/* Webcam Feed - Centered */}
          <div className="w-full h-full flex items-center justify-center">
            {isWebCamEnabled ? (
              <WebCam
                ref={webcamRef}
                audio={false}
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                onUserMedia={() => setIsWebCamEnabled(true)}
                onUserMediaError={() => {
                  setIsWebCamEnabled(false);
                  toast.error("Could not access webcam");
                }}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center">
                <WebcamIcon className="w-24 h-24 text-gray-500" />
              </div>
            )}
          </div>

          {/* AI Interviewer Small Overlay - Positioned absolutely */}
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full border-2 border-white overflow-hidden bg-[rgb(16,23,39)]">
            <div className="relative w-full h-full flex items-center justify-center">
              {!activeUser && (
                <span className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-500 opacity-75 animate-ping z-0" />
              )}
              <Image
                src={AI_RecruiterLogo}
                alt="AI Interviewer"
                width={90}
                height={90}
                className="rounded-full object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permission Request Modal */}
      {showPermissionRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[rgb(16,23,39)] p-6 rounded-lg border border-gray-600 max-w-md">
            <h3 className="text-xl font-bold mb-4">Permissions Required</h3>
            <p className="mb-4">
              Please allow microphone and camera access to continue with the
              interview.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <span>Microphone: {micAllowed ? "Allowed" : "Denied"}</span>
              </div>
              <div className="flex items-center gap-2">
                <WebcamIcon className="h-5 w-5" />
                <span>Camera: {camAllowed ? "Allowed" : "Denied"}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => router.push("/generate")}
              >
                Cancel
              </Button>
              <Button onClick={requestAllPermissions}>Allow Permissions</Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}

      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 mt-5">
        <div className="flex gap-2 md:gap-5">
          <div className="relative">
            <Button
              onClick={() => setShowPermissionRequest(true)}
              variant={micAllowed ? "outline" : "default"}
              className="gap-2 relative overflow-visible"
              disabled={micAllowed}
            >
              <div className="relative flex items-center justify-center">
                {activeUser && (
                  <span className="absolute w-5 h-5 rounded-full bg-blue-500 opacity-75 animate-ping -z-10" />
                )}
                <Mic className="h-5 w-5" />
              </div>
              {micAllowed ? "Mic Active" : "Request Mic"}
            </Button>
          </div>
          <Button
            onClick={() => setShowPermissionRequest(true)}
            variant={camAllowed ? "outline" : "default"}
            className="gap-2"
            disabled={camAllowed}
          >
            <WebcamIcon className="h-5 w-5" />
            {camAllowed ? "Cam Active" : "Request Camera"}
          </Button>
        </div>

        {!loading ? (
          <Button
            variant="destructive"
            onClick={stopInterview}
            className="gap-2 mt-2 md:mt-0 cursor-pointer"
          >
            <Phone className="h-5 w-5" />
            End Interview
          </Button>
        ) : (
          <Loader2Icon className="animate-spin mt-2 md:mt-0" />
        )}
      </div>

      <h2 className="text-md font-bold mt-5 text-gray-500 text-center">
        Interview for {interviewInfo?.jobPosition} is in progress...
      </h2>
    </div>
  );
};
export default StartInterview;
