"use client";
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from "sonner"
import InterviewLink from './_components/InterviewLink';
import { userDetails } from '@/app/provider';

export interface FormData {
    jobPosition: string;
    jobDescription: string;
    type: string[];
    duration: string;
}

const CreateInterview = () => {
    const router = useRouter();
    const {user}=userDetails();
    const [interviewId, setInterviewId] = useState("");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        jobPosition: "",
        jobDescription: "",
        type: [],
        duration: "",
      });
    const onHandleInputChange = (field: string,value:string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }
    const onGoToNext = () => {
        if(user?.credits === 0) {
            toast.error("You don't have enough credits to create an interview , Add more credits to your account");
            return;
        }
        if(!formData.jobPosition || !formData.jobDescription || !formData.type || !formData.duration) {
            console.log("inside next");
            toast.error("All fields are required");
            return
        }
        setStep(step + 1);
    }
    const onCreateLink = (id: string) => {
        setInterviewId(id);
        setStep(step + 1);
    }
  return (
    <div className='mt-5 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex items-center gap-5'>
        <ArrowLeft onClick={() => router.back()} className='h-10 w-10 cursor-pointer'/>
        <h2 className='font-bold text-2xl'>Create New Interview</h2>
        
      </div>
      <Progress value={step * 33.33} className='mt-5 w-full'/>
      {
        step === 1 && <FormContainer onHandleInputChange={onHandleInputChange} goNext={() => onGoToNext()} />
      }
      {
        step === 2 && <QuestionList  formData={formData} onCreateLink={(id: string) => onCreateLink(id)}/>
      }
      {
        step === 3 && <InterviewLink interview_id={interviewId} formData={formData}/> 
      }
    </div>
  )
}

export default CreateInterview
