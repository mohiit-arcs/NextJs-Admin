"use client";

import Sidebar from "@/components/sidebar";
import { useUserProfile } from "@/components/user-profile/page";
import { useRestaurantContext } from "@/contexts/restaurant/RestaurantContext";
import useInterceptor from "@/hooks/useInterceptor";
import { getAuthToken } from "@/services/frontend/storage.service";
import {
  MeApi,
  RestaurantListResponse,
  RestaurantsApi,
  UserProfileResponse,
} from "@/swagger";
import { RoleSlug } from "@prisma/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { setUserProfile } = useUserProfile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { setDefaultRestaurant } = useRestaurantContext();

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
          if (
            response.data?.profile.details.role?.slug ==
            RoleSlug.restaurantAdmin
          ) {
            setInitialRestaurant();
          }
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const setInitialRestaurant = () => {
    try {
      const restaurantApi = new RestaurantsApi();
      restaurantApi
        .findRestaurants({
          limit: 1,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
        .then((response: RestaurantListResponse) => {
          const restaurants: any = response.data?.rows;
          if (restaurants?.length != 0) {
            setDefaultRestaurant(restaurants[0]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSideBarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex w-full h-full bg-[#ffffff]">
      <div
        className={
          sidebarOpen
            ? "lg:w-1/5 h-screen fixed w-full z-10"
            : "lg:w-0 h-screen fixed w-0 z-10"
        }>
        <Sidebar
          sidebarOpen={sidebarOpen}
          handleSideBarToggle={handleSideBarToggle}
        />
      </div>

      <div className="w-full flex justify-end">
        <div
          className={
            sidebarOpen ? "w-4/5 transition-all" : "w-[99%] transition-all"
          }>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
