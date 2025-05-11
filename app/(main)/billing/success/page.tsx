"use client";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BillingSuccessPage = () => {
  return (
    <div className="h-[60vh] mt-10 flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-950 px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. Your credits have been added to your account.
        </p>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BillingSuccessPage;
