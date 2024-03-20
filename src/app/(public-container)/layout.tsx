"use client";

import { getAuthToken } from "@/services/frontend/storage.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return <>{children}</>;
};

export default Layout;
