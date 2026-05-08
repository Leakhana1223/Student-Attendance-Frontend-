"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "teacher") {
          router.push("/student");
        } else {
          router.push("/student");
        }
      } else {
        router.push("/auth/sign-in");
      }
    }
  }, [router, user, isLoading, isAuthenticated]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full border-b-2 border-primary p-5"></div>
    </div>
  );
}
