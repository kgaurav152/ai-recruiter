import React from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
const InterviewCard = ({
  interview,
  viewDetails = false,
}: {
  interview: any;
  viewDetails?: boolean;
}) => {
  const url =
    process.env.NEXT_PUBLIC_HOST_URL + `/interview/${interview?.interview_id}`;
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Link Copied");
  };

  const onSend = () => {
    window.location.href = `mailto:${interview?.userEmail}?subject=Recruitron - AI Interview Link & body=Interview Link: ${url}`;
  };
  return (
    <div className="p-5 dark:bg-[rgb(16,23,39)] rounded-lg border border-gray-300">
      <div className="flex items-center justify-between">
        <div className="h-[40px] w-[40px] rounded-full bg-primary"></div>
        <h2 className="text-sm">
          {moment(interview?.created_at).format("DD MMM YYYY")}
        </h2>
      </div>
      <h2 className="font-bold mt-3 text-lg">{interview?.jobPosition}</h2>
      <h2 className="mt-2 text-gray-400 flex justify-between">
        {interview?.duration}
        {viewDetails && (
          <span className="text-blue-400">
            {interview["interview-feedback"]?.length} Candidates
          </span>
        )}
      </h2>
      {!viewDetails ? (
        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={copyLink}>
            <Copy />
          </Button>
          <Button variant="outline" className="flex-1" onClick={onSend}>
            <Send />
          </Button>
        </div>
      ) : (
        <Link href={`/scheduled-interview/${interview?.interview_id}/details`}>
          <Button className="mt-5 w-full cursor-pointer">
            View Detail <ArrowRight />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default InterviewCard;
