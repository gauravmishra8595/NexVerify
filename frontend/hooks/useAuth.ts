"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects to /login if no access token exists in localStorage.
 * The JWT itself is verified server-side on every API call via the
 * Authorization header - this hook just handles the client-side
 * route guard to avoid a flash of the protected page before redirect.
 */
export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}
