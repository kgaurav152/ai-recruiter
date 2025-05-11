"use client";
import { CheckCircle, Clock, Smile, Undo2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";

const InterviewComplete = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(16,23,39)] text-white px-6 py-16">
      {/* Success icon */}
      <div className="relative mb-6">
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping" />
        <CheckCircle className="h-24 w-24 text-green-500 z-10 relative" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Interview Completed!
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-400 text-center max-w-xl mb-8">
        Great job! You've successfully completed your interview session.
      </p>

      {/* What’s Next section */}
      <div className="bg-[rgb(24,32,48)] rounded-xl border border-gray-700 p-6 w-full max-w-2xl shadow-lg mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-indigo-400" />
          <h2 className="text-xl font-semibold">What’s Next?</h2>
        </div>
        <p className="text-gray-300 mb-2">
          We’ll review your responses and get in touch with you soon regarding the next steps in the hiring process.
        </p>
        <p className="text-sm text-gray-500">
          You can expect a detailed interview response within 2–3 business days.
        </p>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex flex-col md:flex-row items-center gap-4">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-all">
            <LayoutDashboard className="h-5 w-5" />
            Back to Dashboard
          </button>
        </Link>
        <Link href="/interview/start">
          <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full transition-all">
            <Undo2 className="h-5 w-5" />
            Retake Interview
          </button>
        </Link>
      </div> */}

      {/* Footer icon */}
      <Smile className="text-yellow-400 mt-10 h-8 w-8 animate-bounce" />
    </div>
  );
};

export default InterviewComplete;
