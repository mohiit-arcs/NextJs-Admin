"use client";
import {
  getAuthToken,
  setAuthToken,
} from "@/services/frontend/storage.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Interceptor = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const apiInterceptor = () => {
    const originalFetch = window.fetch;

    window.fetch = async (
      input: RequestInfo | URL,
      init: RequestInit = {}
    ): Promise<Response> => {
      const token = getAuthToken();
      const headers: any = { ...init.headers };
      if (token && token !== "") {
        headers["Authorization"] = `Bearer ${token}`;
      }
      init.headers = headers;
      return new Promise(async (resolve, reject) => {
        try {
          const res = await originalFetch(input as Request, init);
          if ([400, 401, 422, 404, 419, 500, 403].includes(res.status)) {
            const response = await res.json();
            if (res.status === 401 || res.status == 403) {
              setAuthToken("");
              router.push("/login");
            }
            return reject(response);
          }

          return resolve(res);
        } catch (error: any) {
          return reject(error);
        }
      });
    };
  };
  useEffect(() => {
    apiInterceptor();
  }, []);
  return <>{children}</>;
};

export default Interceptor;
