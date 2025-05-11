"use client";
import { UserDetailsContext, UserType } from "@/context/UserDetailsContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        const { data: Users, error: fetchError } = await supabase
          .from("Users")
          .select("*")
          .eq("email", session.user.email);
        if (fetchError) throw fetchError;

        if (Users?.length > 0) {
          setUser(Users[0] as UserType);
        }
      }
    } catch (err: any) {
      console.error("Error fetching user:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUser();
        } else {
          setUser(null);
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
