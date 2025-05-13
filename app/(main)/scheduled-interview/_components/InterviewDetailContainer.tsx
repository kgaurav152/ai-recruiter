import { Calendar, Clock } from "lucide-react";
import React from "react";
import moment from "moment";
const InterviewDetailContainer = ({
  interviewDetails,
}: {
  interviewDetails: any;
}) => {
  const typeRaw = interviewDetails?.type;
  const typeArray = typeRaw ? JSON.parse(typeRaw) : [];
  const firstType = typeArray[0];
  return (
    <div className="p-5 dark:bg-[rgb(16,23,39)] rounded-lg mt-5">
      <h2 className="text-2xl font-bold">{interviewDetails?.jobPosition}</h2>
      <div className="mt-4 flex items-center justify-between lg:pr-52">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-gray-400 dark:text-gray-300">Duration</h2>
          <h2 className="flex text-sm font-bold gap-3">
            <Clock /> {interviewDetails?.duration}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-gray-400 dark:text-gray-300">
            Created On
          </h2>
          <h2 className="flex text-sm font-bold gap-3">
            <Calendar />{" "}
            {moment(interviewDetails?.created_at).format("DD MMM YYYY")}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-gray-400 dark:text-gray-300">Type</h2>
          <h2 className="flex text-sm font-bold gap-3">
            <Clock /> {firstType}
          </h2>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-400 dark:text-gray-300">
          Job Description:
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          {interviewDetails?.jobDescription}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-400 dark:text-gray-300">
          Interview Questions
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {interviewDetails?.questionList.map((item: any, index: number) => (
            <h2 key={index} className="text-muted-foreground">
              {" "}
              {index + 1}. {item.question}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailContainer;
