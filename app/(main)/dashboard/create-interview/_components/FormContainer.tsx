import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { use, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FormContainer = ({
  onHandleInputChange,
  goNext
}: {
  onHandleInputChange: (field: string, value: string | string[]) => void;
  goNext: () => void;
}) => {
  const [selectInterviewType, setSelectInterviewType] = useState<string[]>([]);
//   useEffect(() => {
//     onHandleInputChange("type", selectInterviewType);
//   }, [selectInterviewType]);

  const AddInterviewType = (type: string) => {
    let updated: string[];

    if (!selectInterviewType.includes(type)) {
      updated = [...selectInterviewType, type];
    } else {
      updated = selectInterviewType.filter((item) => item !== type);
    }
  
    setSelectInterviewType(updated);
    onHandleInputChange("type", updated);
  };
  return (
    <div className="p-5 bg-[rgb(16,23,39)] rounded-2xl shadow-lg mt-5">
      <div>
        <h2 className="font-bold text-md">Job Position</h2>
        <Input
          type="text"
          placeholder="e.g. Full Stack Developer"
          className=" border border-gray-600 rounded-md py-2 px-3 mt-2 w-full text-md"
          onChange={(e) => onHandleInputChange("jobPosition", e.target.value)}
        />
      </div>
      <div className="mt-5">
        <h2 className="font-bold text-md">Job Description</h2>
        <Textarea
          placeholder="Describe the job role and responsibilities"
          className=" border border-gray-600 rounded-md py-2 px-3 mt-2 w-full text-md h-[200px]"
          onChange={(e) =>
            onHandleInputChange("jobDescription", e.target.value)
          }
        />
      </div>
      <div className="mt-5">
        <h2 className="font-bold text-md mb-2">Interview Duration</h2>
        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 min</SelectItem>
            <SelectItem value="15 Min">15 min</SelectItem>
            <SelectItem value="30 Min">30 min</SelectItem>
            <SelectItem value="45 Min">45 min</SelectItem>
            <SelectItem value="60 Min">60 min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5">
        <h2 className="font-bold text-md">Interview Type</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex gap-2 border border-gray-600 rounded-full py-2 px-3 items-center cursor-pointer hover:bg-gray-400 transition-all duration-200 ${
                selectInterviewType.includes(type.title) &&
                "bg-green-300 text-black"
              }`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className="h-6 w-6 text-blue-600" />
              <h2>{type.title}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="mt-5 cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200"
            onClick={goNext}
        >
          Generate Question <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
