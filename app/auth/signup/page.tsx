"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMicrophoneAlt } from "react-icons/fa";
import { supabase } from "@/services/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            picture: "https://placehold.co/128x128/E0E0E0/A0A0A0/png?text=A",
          },
        },
      });

      if (error) throw error;

      const { error: insertError } = await supabase.from("Users").insert({
        email: data.email,
        name: data.name,
        picture: "https://placehold.co/128x128/E0E0E0/A0A0A0/png?text=A",
      });

      if (insertError) throw insertError;

      form.reset();
      alert(
        "Signup successful! Please check your email to verify your account."
      );
    } catch (err: any) {
      console.error("Signup error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2 text-2xl font-bold">
            Sign up to <span className="text-blue-600">Recruitron</span>{" "}
            <span className="text-red-600">
              <FaMicrophoneAlt />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing Up" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/auth" className="text-blue-600">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
