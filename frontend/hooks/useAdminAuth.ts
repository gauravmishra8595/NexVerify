"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAdminAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_access");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  return ready;
}
