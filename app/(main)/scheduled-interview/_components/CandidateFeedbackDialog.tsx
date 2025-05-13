import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const CandidateFeedbackDialog = ({ candidate }: { candidate: any }) => {
  const feedback = candidate?.feedback?.feedback;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="cursor-pointer hover:bg-blue-500 transition-all duration-200"
        >
          View Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] pr-4">
          <DialogDescription asChild>
            <div>
              <div className="p-5 flex gap-3 items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-gray-700 dark:bg-gray-500 p-3 rounded-full px-4.5 font-bold text-md">
                    {candidate?.userName[0]}
                  </h2>
                  <div className="">
                    <h2 className="font-bold text-md text-gray-700 dark:text-gray-500">
                      {candidate?.userName}
                    </h2>
                    <h2 className="text-gray-500 dark:text-gray-400 text-sm">
                      {candidate?.userEmail}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-green-500 dark:text-green-300 text-2xl">
                    {feedback?.rating?.totalRating
                      ? feedback?.rating?.totalRating
                      : 0}
                    /10
                  </h2>
                </div>
              </div>
              <div className="mt-5">
                <h2 className="font-bold text-lg">Skill Assessment:</h2>
                <div className="mt-3 grid grid-cols-2 gap-5">
                  <div>
                    <h2 className="flex items-center justify-between">
                      Technical Skills{" "}
                      <span className="font-bold text-green-500 dark:text-green-300 text-lg">
                        {feedback?.rating?.technicalSkills}/10
                      </span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.technicalSkills * 10}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <h2 className="flex items-center justify-between">
                      Communication Skills{" "}
                      <span className="font-bold text-green-500 dark:text-green-300 text-lg">
                        {feedback?.rating?.communication}/10
                      </span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.communication * 10}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <h2 className="flex items-center justify-between">
                      Problem Solving Skills{" "}
                      <span className="font-bold text-green-500 dark:text-green-300 text-lg">
                        {feedback?.rating?.problemSolving}/10
                      </span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.problemSolving * 10}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <h2 className="flex items-center justify-between">
                      Experience{" "}
                      <span className="font-bold text-green-500 dark:text-green-300 text-lg">
                        {feedback?.rating?.experience}/10
                      </span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.experience * 10}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="font-bold text-lg">Performace Summary:</h2>
                <p className="dark:bg-gray-500 rounded-md text-green-400 dark:text-green-300 font-bold text-sm p-3 mt-3">
                  {feedback?.summary}
                </p>
              </div>

              <div
                className={`p-5 mt-10 ${
                  feedback?.recommendation == "No"
                    ? "bg-red-200"
                    : "bg-green-200"
                } rounded-md flex items-center justify-between`}
              >
                <div>
                  <h2
                    className={`font-bold text-lg ${
                      feedback?.recommendation == "No"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    Recommendation Msg:
                  </h2>
                  <p
                    className={`text-sm ${
                      feedback?.recommendation == "No"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {feedback?.recommendationMsg}
                  </p>
                </div>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    window.open(
                      `mailto:${
                        candidate?.userEmail
                      }?subject=Recruitron - Candidate Feedback & body=${
                        "Based on your interview feedback, I would recommend " +
                        (feedback?.recommendation == "No" ? "NOT" : "") +
                        " hiring " +
                        candidate?.userName +
                        "."
                      }`,
                      "_blank"
                    );
                  }}
                  className={`${
                    feedback?.recommendation == "No"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } mt-3 text-white cursor-pointer hover:bg-blue-500 transition-all duration-200`}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateFeedbackDialog;
