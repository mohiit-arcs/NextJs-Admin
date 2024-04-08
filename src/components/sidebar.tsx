import {
  Hotel,
  Key,
  LayoutDashboardIcon,
  LogOut,
  User,
  Users,
  Utensils,
  Menu,
  Percent,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUserProfile } from "./user-profile/page";
import { RoleSlug } from "@prisma/client";
import { setAuthToken } from "@/services/frontend/storage.service";
import Link from "next/link";
import { useState } from "react";

const activeClass = "rounded-full text-[#FFFFFF] bg-[#EBA232]";
const Sidebar = ({
  sidebarOpen,
  handleSideBarToggle,
}: {
  sidebarOpen: boolean;
  handleSideBarToggle: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const sidebarCloseClass = " hidden";

  const logout = () => {
    setAuthToken("");
    router.push("/login");
  };

  return (
    <div className="flex h-full">
      <div className={sidebarOpen == false ? sidebarCloseClass : "w-full"}>
        <div className="bg-[#0F172A] h-full relative px-4 py-2">
          <div className="text-center">
            <h1 className="text-2xl text-[#FFFFFF] font-bold my-3">
              Admin Dashboard
            </h1>
          </div>
          <ul className="mt-3 overflow-y-auto text-[#FFFFFF] font-normal pr-10">
            <li className="group hover:text-[#EBA232]">
              <Link
                className={
                  `flex items-center  p-2 ` +
                  (pathname === "/dashboard" ? activeClass : "")
                }
                href={"/dashboard"}>
                <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                  <LayoutDashboardIcon width={16} height={16} />
                </div>
                <span className="text-xs ml-2">Dashboard</span>
              </Link>
            </li>
            {userProfile?.role?.slug == RoleSlug.superAdmin && (
              <li className="group hover:text-[#EBA232]">
                <Link
                  className={
                    `flex items-center  p-2 ` +
                    (pathname === "/user-list" ? activeClass : "")
                  }
                  href={"/user-list"}>
                  <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                    <Users width={16} height={16} />
                  </div>
                  <span className="text-xs ml-2">Users</span>
                </Link>
              </li>
            )}
            {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
              <li className="group hover:text-[#EBA232]">
                <Link
                  className={
                    `flex items-center  p-2 ` +
                    (pathname === "/restaurant-list" ? activeClass : "")
                  }
                  href={"/restaurant-list"}>
                  <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                    <Hotel width={16} height={16} />
                  </div>
                  <span className="text-xs ml-2">Restaurants</span>
                </Link>
              </li>
            )}
            {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
              <li className="group hover:text-[#EBA232]">
                <Link
                  className={
                    `flex items-center  p-2 ` +
                    (pathname === "/taxFee-list" ? activeClass : "")
                  }
                  href={"/taxFee-list"}>
                  <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                    <Percent width={16} height={16} />
                  </div>
                  <span className="text-xs ml-2">Tax & Fees</span>
                </Link>
              </li>
            )}
            {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
              <li className="group hover:text-[#EBA232]">
                <Link
                  className={
                    `flex items-center  p-2 ` +
                    (pathname === "/menu-category-list" ? activeClass : "")
                  }
                  href={"/menu-category-list"}>
                  <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                    <Menu width={16} height={16} />
                  </div>
                  <span className="text-xs ml-2">Menu Categories</span>
                </Link>
              </li>
            )}
            {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
              <li className="group hover:text-[#EBA232]">
                <Link
                  className={
                    `flex items-center  p-2 ` +
                    (pathname === "/food-item-list" ? activeClass : "")
                  }
                  href={"/food-item-list"}>
                  <div className="p-1 flex justify-center group-hover:text-[#EBA232] items-center rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                    <Utensils width={16} height={16} />
                  </div>
                  <span className="text-xs ml-2">Food Items</span>
                </Link>
              </li>
            )}
          </ul>
          <ul className="text-[#FFFFFF] font-normal absolute bottom-0 pr-10 w-[90%]">
            <li className="group hover:text-[#EBA232]">
              <Link
                className={
                  `flex items-center  p-2 ` +
                  (pathname === "/profile" ? activeClass : "")
                }
                href={"/profile"}>
                <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                  <User width={16} height={16} />
                </div>
                <span className="text-xs ml-2">Profile</span>
              </Link>
            </li>
            <li className="group hover:text-[#EBA232]">
              <Link
                className={
                  `flex items-center  p-2 ` +
                  (pathname === "/change-password" ? activeClass : "")
                }
                href={"/change-password"}>
                <div className="p-1 flex justify-center items-center group-hover:text-[#EBA232] rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF]">
                  <Key width={16} height={16} />
                </div>
                <span className="text-xs ml-2">Change Password</span>
              </Link>
            </li>
            <li
              className="flex cursor-pointer group items-center hover:text-[#EBA232]  p-2"
              onClick={() => logout()}>
              <div className="p-1 flex justify-center items-center rounded-full w-8 h-8 bg-[#0F172A] text-[#FFFFFF] group-hover:text-[#EBA232]">
                <LogOut width={16} height={16} />
              </div>
              <span className="text-xs ml-2">Log Out</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        onClick={() => handleSideBarToggle()}
        className="bg-[#0F172A] w-4 flex items-center justify-center">
        <span>{sidebarOpen ? <ChevronLeft color="white" /> : null}</span>
        <span>
          {sidebarOpen != true ? <ChevronRight color="white" /> : null}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
