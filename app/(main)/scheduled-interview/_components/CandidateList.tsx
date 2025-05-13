import React from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";
const CandidateList = ({ candidateList }: { candidateList: any[] }) => {
  console.log("details", candidateList);
  return (
    <div className="dark:bg-[rgb(16,23,39)] mt-5 rounded-md">
      <h2>Candidates {candidateList?.length}</h2>
      <div>
        {candidateList?.map((item: any, index: number) => (
          <div
            className="p-5 flex gap-3 items-center justify-between"
            key={index}
          >
            <div className="flex items-center gap-3">
              <h2 className="bg-gray-500 p-3 rounded-full px-4.5 font-bold text-md">
                {item?.userName[0]}
              </h2>
              <div className="">
                <h2 className="font-bold text-md">{item?.userName}</h2>
                <h2 className="text-gray-500 dark:text-gray-400 text-sm">
                  Completed On: {moment(item?.created_at).format("DD MMM YYYY")}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-green-300">
                {item?.feedback?.feedback?.rating?.totalRating
                  ? item?.feedback?.feedback?.rating?.totalRating
                  : 0}
                /10
              </h2>
              <CandidateFeedbackDialog candidate={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
