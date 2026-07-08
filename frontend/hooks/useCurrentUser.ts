"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import type { AuthUser } from "@/types/auth";

interface UseCurrentUserResult {
  user: AuthUser | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

/**
 * Fetches the logged-in user's profile from the database via /api/accounts/me/.
 * This is the single source of truth for user state - replaces the old pattern
 * of storing username/email/verification_status in localStorage which meant
 * the frontend could get out of sync with the DB.
 */
export default function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    api
      .get<AuthUser>("/accounts/me/")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError(true);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tick]);

  return { user, loading, error, refetch };
}
