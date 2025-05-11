"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Brain,
  Settings2,
  UserCheck,
  BarChart,
  ArrowRight,
  MessageSquareHeart,
  Zap,
  UserPlus,
} from "lucide-react";

export default function FullLandingPage() {
  const router = useRouter();

  return (
    <main className="bg-slate-900 text-white min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-500">
            <Brain className="w-6 h-6" />
            AI Recruiter
          </div>
          <nav className="hidden md:flex gap-6 text-gray-300">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          {/* <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button> */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Supercharge Hiring with <span className="text-blue-500">AI Interviews</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Build smart, customized interviews. Get meaningful candidate insights. Hire better.
        </p>
        <Button size="lg" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-lg px-6 py-4" onClick={() => router.push("/dashboard")}>
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-800 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <Feature icon={<Settings2 className="text-blue-400 w-10 h-10 mx-auto" />} title="Smart Interviews" description="Generate tailored interview questions using AI." />
          <Feature icon={<UserCheck className="text-green-400 w-10 h-10 mx-auto" />} title="Candidate Insights" description="Analyze answers, rank candidates, and reduce bias." />
          <Feature icon={<BarChart className="text-purple-400 w-10 h-10 mx-auto" />} title="Performance Metrics" description="Track interview stats and candidate quality over time." />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-3">
          <Step icon={<UserPlus className="text-yellow-400 w-8 h-8 mx-auto" />} title="1. Add Candidate" description="Quickly enter candidate details and role." />
          <Step icon={<Zap className="text-pink-400 w-8 h-8 mx-auto" />} title="2. Generate Interview" description="AI instantly creates custom questions." />
          <Step icon={<MessageSquareHeart className="text-blue-400 w-8 h-8 mx-auto" />} title="3. Review & Decide" description="Review answers, get AI feedback, and hire!" />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-800 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Simple Pricing</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard credits={20} price="$5" />
          <PricingCard credits={40} price="$12" />
        </div>
      </section>

      {/* Contact/CTA Footer */}
      <footer id="contact" className="text-center py-10 border-t border-slate-700">
        <h3 className="text-xl font-semibold mb-2">Questions?</h3>
        <p className="text-gray-400 mb-6">Email us at <a href="mailto:support@airecruiter.com" className="text-blue-500 hover:underline">example@airecruiter.com</a></p>
        <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
          Go to Dashboard
        </Button>
        <p className="text-sm text-gray-500 mt-6">© {new Date().getFullYear()} AI Recruiter. All rights reserved.</p>
      </footer>
    </main>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div>
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function Step({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div>
      {icon}
      <h4 className="text-lg font-semibold mt-3">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function PricingCard({ credits, price }: { credits: number, price: string }) {
  return (
    <div className="bg-slate-700 p-6 rounded-xl border border-slate-600">
      <h4 className="text-2xl font-bold text-blue-400 mb-2">{credits} Credits</h4>
      <p className="text-3xl font-extrabold mb-2">{price}</p>
      <p className="text-gray-300 mb-4">Use credits anytime for interviews.</p>
    </div>
  );
}
