"use client";
import { userDetails } from "@/app/provider";
import { Loader2Icon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = userDetails();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !loading &&
      !user &&
      pathname !== "/" &&
      !pathname?.startsWith("/interview") &&
      pathname?.startsWith("/auth") === false
    ) {
      router.replace("/auth");
    }
    // if (!loading && user && pathname === "/") {
    //   router.replace("/dashboard");
    // }
  }, [user, loading, pathname]);

  if (loading)
    return (
      <div className="h-screen w-[100vw] flex items-center justify-center">
        <Loader2Icon className="animate-spin w-32 h-32" />
      </div>
    );
  1;
  return <>{children}</>;
};

export default AuthWrapper;
