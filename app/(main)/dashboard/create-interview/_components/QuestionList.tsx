"use client";
import React, { useEffect, useState } from "react";
import { FormData } from "../page";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { userDetails } from "@/app/provider";
import { v4 as uuid } from "uuid";
const QuestionList = ({
  formData,
  onCreateLink,
}: {
  formData: FormData;
  onCreateLink: (id: string) => void;
}) => {
  const { user } = userDetails();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);
  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });
      const response = result?.data?.content;
      const match = response.match(/```json\s*([\s\S]*?)\s*```/);

      if (!match || match.length < 2) {
        throw new Error("No valid JSON block found in the response.");
      }

      // Step 2: Parse the extracted JSON string
      const jsonString = match[1].trim();

      // Remove variable assignment if present
      const cleanedJson = jsonString.replace(/^interviewQuestions\s*=\s*/, "");

      const parsed = JSON.parse(cleanedJson);
      const finalData = parsed; // Now it's just the array
      console.log(finalData);
      setQuestionList(finalData);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while generating questions");
      setLoading(false);
    }
  };
  const onFinish = async () => {
    setLoading2(true);
    const interview_id = uuid();
    const { data, error } = await supabase
      .from("Interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    //update user creadits

    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits) - 1 })
      .eq("email", user?.email)
      .select();

    console.log(userUpdate);

    setLoading2(false);
    onCreateLink(interview_id);
  };
  return (
    <div>
      {loading && (
        <div className="p-5 bg-[rgb(16,23,39)] rounded-2xl shadow-lg mt-5 flex flex-col gap-3 border border-gray-300 items-center">
          <Loader2Icon className="animate-spin w-30 h-30" />
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-lg font-bold">
              Generating Interview Questions
            </h2>
            <p className="text-muted-foreground">
              Our AI model is generating interview questions based on your job
              description.
            </p>
          </div>
        </div>
      )}
      {questionList.length > 0 && (
        <>
          <h2 className="font-bold text-2xl">Generated Interview Questions</h2>
          <div className="p-5 bg-[rgb(16,23,39)] mt-5 rounded-2xl flex flex-col gap-3">
            {questionList.map((item: any, index: number) => (
              <div
                key={index}
                className="p-3 border border-gray-300 flex flex-col gap-2 rounded-2xl"
              >
                <h2 className="font-medium">
                  <span className="font-bold text-blue-600">
                    Question {index + 1}
                  </span>
                  : {item.question}
                </h2>
                <h2>
                  <span className="font-bold text-blue-600">Type</span>:{" "}
                  {item.type}
                </h2>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5 cursor-pointer">
            <Button disabled={loading2} onClick={onFinish}>
              {loading2 && <Loader2Icon className="animate-spin w-4 h-4" />}
              Create Interview Link & Finish
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionList;
