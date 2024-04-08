"use client";

import Sidebar from "@/components/sidebar";
import { useUserProfile } from "@/components/user-profile/page";
import useInterceptor from "@/hooks/useInterceptor";
import { getAuthToken } from "@/services/frontend/storage.service";
import { MeApi, UserProfileResponse } from "@/swagger";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { setUserProfile } = useUserProfile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      return redirect("/login");
    }
    setProfile();
  }, []);

  useInterceptor();

  const setProfile = () => {
    try {
      const meApi = new MeApi();
      meApi.profile().then((response: UserProfileResponse) => {
        if (response.data?.profile?.details?.id) {
          setUserProfile(response.data?.profile.details);
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSideBarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex w-full h-full bg-[#ffffff]">
      <div className="w-1/5 h-screen fixed">
        <Sidebar
          sidebarOpen={sidebarOpen}
          handleSideBarToggle={handleSideBarToggle}
        />
      </div>

      <div className="w-full flex justify-end">
        <div className={sidebarOpen ? "w-4/5" : "w-[99%]"}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
