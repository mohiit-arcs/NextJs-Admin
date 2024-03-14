"use client";
import { getAuthToken } from "@/services/frontend/storage.service";
import { useEffect } from "react";

const apiInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    const headers: any = {...init.headers};
    if(token && token !== ''){
      headers['Authorization'] = `Bearer ${token}`;
    }
    init.headers = headers;

    return originalFetch(input, init);
  };
};

const useInterceptor = () => {
  useEffect(() => {
    apiInterceptor();
  }, []);
};

export default useInterceptor;
