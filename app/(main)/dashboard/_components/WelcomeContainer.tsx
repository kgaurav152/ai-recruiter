"use client";
import { userDetails } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const WelcomeContainer = () => {
  const { user } = userDetails();
  const router = useRouter();

  const handleLogout = async() => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      router.push("/auth"); // redirect to landing/login page
    }
  }
  return (
    <div>
      <div className=" bg-[rgb(16,23,39)] shadow-md rounded-md px-10 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Welcome Back , {user?.name}</h2>
          <h2 className="text-blue-300">
            AI-Driven Interviews , Hiring Made Easy
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Image
              src={user?.picture}
              alt="user"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          <Button className="bg-transparent text-white cursor-pointer hover:bg-transparent hover:text-blue-600 " onClick={handleLogout}>
            Logout <LogOutIcon size={30}/>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeContainer;
