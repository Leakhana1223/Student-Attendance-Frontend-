"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to auth/sign-in page without authentication
    if (!isLoading && !isAuthenticated && !pathname.startsWith("/auth")) {
      router.push("/auth/sign-in");
    }

    // Role-based access control
    if (!isLoading && isAuthenticated && user) {
      const role = user.role;
      
      // Teacher restrictions
      if (role === "teacher") {
        const teacherRestrictedPaths = ["/dashboard", "/class", "/user", "/subject"];
        const isRestricted = teacherRestrictedPaths.some(path => 
          pathname === path || pathname.startsWith(path + "/")
        );
        
        if (isRestricted) {
          router.push("/attendance");
        }
      }
      
      // Prevent student access (should be blocked by backend but for safety)
      if (role === "student") {
        router.push("/auth/sign-in");
        localStorage.clear(); // Clear local storage if student somehow logged in
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full border-b-2 border-primary p-5"></div>
      </div>
    );
  }

  // Show sign in page without sidebar/header
  if (!isAuthenticated && pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  // Show dashboard with sidebar and header
  return (
    <>
      <NextTopLoader color="#5750F1" showSpinner={false} />

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
