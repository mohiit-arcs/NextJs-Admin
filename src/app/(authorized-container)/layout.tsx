"use client";

import useInterceptor from "@/hooks/useInterceptor";
import { getAuthToken } from "@/services/frontend/storage.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useInterceptor()
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      return router.push("/login");
    }
  }, []);

  return <>{children}</>;
};

export default Layout;
