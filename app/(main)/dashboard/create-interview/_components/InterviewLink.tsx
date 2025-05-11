import Image from "next/image";
import { FormData } from "../page";
import {
  ArrowLeft,
  CircleCheckBig,
  Clock,
  List,
  Mail,
  Plus,
  Slack,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsWhatsapp } from "react-icons/bs";
import Link from "next/link";
import { toast } from "sonner";
const InterviewLink = ({
  interview_id,
  formData,
}: {
  interview_id: string;
  formData: FormData;
}) => {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview_id;
  const GetInterviewUrl = () => {
    return url;
  };
  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link Copied");
  };
  const sendOnWhatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Hey! Here's your interview link: ${url}`
      )}`,
      "_blank"
    );
  };
  const sendEmail = () => {
    window.open(
      `mailto:?subject=Recruitron - AI Interview Link & body=Interview Link: ${url}`,
      "_blank"
    );
  };
  const sendOnSlack = () => {
    window.open(
      `https://slack.com/app_redirect?channel=${encodeURIComponent(
        `general`
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-5 p-5">
      <CircleCheckBig className="bg-green-500 h-18 w-18 rounded-full" />

      <h2 className="text-2xl font-bold">
        Your AI Interview is ready to be scheduled
      </h2>

      <p className="text-muted-foreground">
        Share the link with the candidate to start the interview process
      </p>

      <div className="w-full p-7 bg-[rgb(16,23,39)] rounded-md mt-5">
        <div className="flex items-center     justify-between">
          <h2 className="text-lg font-bold">Interview Link</h2>
          <h2 className="p-1 px-2 border rounded-md text-blue-500 bg-blue-200">
            Valid for 30 days
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Input defaultValue={GetInterviewUrl()} disabled={true} />
          <Button
            onClick={onCopyLink}
            variant={"outline"}
            className="cursor-pointer"
          >
            Copy Link
          </Button>
        </div>
        <hr className="my-7" />
        <div className="flex gap-3">
          <h2 className="text-sm text-gray-400 flex gap-2 items-center">
            <Clock className="h-4 w-4" /> {formData?.duration}
          </h2>
          <h2 className="text-sm text-gray-400 flex gap-2 items-center">
            <List className="h-4 w-4" /> 10 Questions
          </h2>
        </div>
      </div>
      <div className="w-full p-7 bg-[rgb(16,23,39)] rounded-md mt-5">
        <h2 className="text-lg font-bold">Share the link via</h2>
        <div className="mt-3 flex items-center justify-between">
          <Button variant={"outline"} onClick={sendEmail}>
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
          <Button variant={"outline"} onClick={sendOnSlack}>
            <Slack className="mr-2 h-4 w-4" /> Slack
          </Button>
          <Button variant={"outline"} onClick={sendOnWhatsapp}>
            <BsWhatsapp className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-6">
        <Link href={"/dashboard"}>
          <Button variant={"outline"}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <Link href={"/create-interview"}>
          {" "}
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
