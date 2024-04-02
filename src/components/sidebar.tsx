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
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUserProfile } from "./user-profile/page";
import { RoleSlug } from "@prisma/client";
import { setAuthToken } from "@/services/frontend/storage.service";
import Link from "next/link";

const activeClass = "rounded-full text-[#FFFFFF] bg-[#F58220]";
const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserProfile();

  const logout = () => {
    setAuthToken("");
    router.push("/login");
  };

  return (
    <div className="bg-[#FFFFFF] h-full px-4 py-2">
      <div className="text-center">
        <h1 className="text-2xl text-[#0F172A] font-bold">Admin Dashboard</h1>
      </div>
      <ul className="mt-3 text-[#0F172A] font-bold">
        <li>
          <Link
            className={
              `flex items-center mb-2 p-2 ` +
              (pathname === "/dashboard" ? activeClass : "")
            }
            href={"/dashboard"}>
            <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
              <LayoutDashboardIcon width={20} height={20} />
            </div>
            <span className="text-sm ml-2">Dashboard</span>
          </Link>
        </li>
        {userProfile?.role?.slug == RoleSlug.superAdmin && (
          <li>
            <Link
              className={
                `flex items-center mb-2 p-2 ` +
                (pathname === "/user-list" ? activeClass : "")
              }
              href={"/user-list"}>
              <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
                <Users width={20} height={20} />
              </div>
              <span className="text-sm ml-2">Users</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li>
            <Link
              className={
                `flex items-center mb-2 p-2 ` +
                (pathname === "/restaurant-list" ? activeClass : "")
              }
              href={"/restaurant-list"}>
              <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
                <Hotel width={20} height={20} />
              </div>
              <span className="text-sm ml-2">Restaurants</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li>
            <Link
              className={
                `flex items-center mb-2 p-2 ` +
                (pathname === "/taxFee-list" ? activeClass : "")
              }
              href={"/taxFee-list"}>
              <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
                <Percent width={20} height={20} />
              </div>
              <span className="text-sm ml-2">Tax & Fees</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li>
            <Link
              className={
                `flex items-center mb-2 p-2 ` +
                (pathname === "/menu-category-list" ? activeClass : "")
              }
              href={"/menu-category-list"}>
              <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
                <Menu width={20} height={20} />
              </div>
              <span className="text-sm ml-2">Menu Categories</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li>
            <Link
              className={
                `flex items-center mb-2 p-2 ` +
                (pathname === "/food-item-list" ? activeClass : "")
              }
              href={"/food-item-list"}>
              <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
                <Utensils width={20} height={20} />
              </div>
              <span className="text-sm ml-2">Food Items</span>
            </Link>
          </li>
        )}
      </ul>
      <ul className="mt-3 text-[#0F172A] font-bold">
        <li>
          <Link
            className={
              `flex items-center mb-2 p-2 ` +
              (pathname === "/profile" ? activeClass : "")
            }
            href={"/profile"}>
            <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
              <User width={20} height={20} />
            </div>
            <span className="text-sm ml-2">Profile</span>
          </Link>
        </li>
        <li className="hover:text-[#f58220]">
          <Link
            className={
              `flex items-center mb-2 p-2 ` +
              (pathname === "/change-password" ? activeClass : "")
            }
            href={"/change-password"}>
            <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
              <Key width={20} height={20} />
            </div>
            <span className="text-sm ml-2">Change Password</span>
          </Link>
        </li>
        <li
          className="flex cursor-pointer items-center hover:text-[#f58220] mb-2 p-2"
          onClick={() => logout()}>
          <div className="p-1 flex justify-center items-center rounded-full w-10 h-10 bg-[#FFFFFF] text-[#0F172A]">
            <LogOut width={20} height={20} />
          </div>
          <span className="text-sm ml-2">Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
