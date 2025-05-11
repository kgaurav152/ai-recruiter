"use client";
import { UserDetailsContext, UserType } from "@/context/UserDetailsContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const createNewUser = () => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }
      let { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user?.email);
      if (Users?.length === 0) {
        const { data, error } = await supabase.from("Users").insert({
          email: user?.email,
          name: user?.user_metadata?.name,
          picture: user?.user_metadata?.picture,
        });
        if (error) {
          console.error("Insert error:", error.message);
          setLoading(false);
        } else {
          setUser(data);
          console.log("User inserted:", data);
          setLoading(false);
          return;
        }
      }
      //ts-ignore
      setUser(Users?.[0]);
      setLoading(false);
    });
  };
  useEffect(() => {
    // Initial fetch
    createNewUser();

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          createNewUser();
        } else {
          // User is logged out
          setUser(null);
          setLoading(false); // Stop loader
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  return (
    <UserDetailsContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export default Provider;

export const userDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserDetailsProvider");
  }
  return context;
};
