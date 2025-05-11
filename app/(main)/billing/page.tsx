"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard } from "lucide-react";
import { userDetails } from "@/app/provider";
import axios from "axios";
const plans = [
  {
    title: "20 Credits",
    price: "$5",
    description: "Buy 20 AI interview credits to use anytime.",
    stripePriceId: process.env.NEXT_PUBLIC_PRICE_ID_20, // Replace with your actual Stripe Price ID
  },
  {
    title: "40 Credits",
    price: "$12",
    description: "Buy 40 AI interview credits and save more.",
    stripePriceId: process.env.NEXT_PUBLIC_PRICE_ID_40, // Replace with your actual Stripe Price ID
  },
];

const BillingPage = () => {
  const { user } = userDetails();
  const handleCheckout = async (priceId: string) => {
    try {
      const response = await axios.post("/api/create-checkout-session", {
        priceId,
        userEmail: user?.email,
      });

      const data = response.data;
      console.log("Stripe session response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };
  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 p-10 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-3">Billing & Credits</h1>
        <h2 className="text-2xl font-semibold mb-3">Your current credits: <span className="text-blue-400">{user?.credits}</span></h2>
        <p className="text-gray-400 mb-10">
          Add credits to continue creating AI interviews. Choose the best plan
          for your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className="bg-slate-800 border border-slate-700"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="text-blue-400" /> {plan.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">{plan.price}</p>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCheckout(plan.stripePriceId as string)}
                >
                  Add Credits
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="mt-5 text-center border-t border-gray-700 pt-8">
          <h2 className="text-xl font-semibold text-white mb-2">Need help?</h2>
          <p className="text-gray-400">
            Contact our team if you have questions about billing or custom plans.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default BillingPage;
