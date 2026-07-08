"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DSAQuiz from "@/components/assessment/DSAQuiz";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";

export default function DSAPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user.is_email_verified) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!user || !user.is_email_verified) {
    // Redirect is in progress
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return <DSAQuiz />;
}
