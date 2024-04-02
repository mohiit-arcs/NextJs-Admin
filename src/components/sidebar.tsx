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

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userProfile } = useUserProfile();

  const logout = () => {
    setAuthToken("");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gray-800 fixed h-full px-4 py-2">
      <div className="my-2 mb-4">
        <h1 className="text-2xl text-white font-bold">Admin Dashboard</h1>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow py-2">
          <Link
            className={
              pathname == "/dashboard"
                ? "flex bg-blue-500 py-2 rounded"
                : "flex"
            }
            href={"/dashboard"}>
            <LayoutDashboardIcon width={100} height={30} />
            <span className="text-sm">Dashboard</span>
          </Link>
        </li>
        {userProfile?.role?.slug == RoleSlug.superAdmin && (
          <li className="mb-2 flex rounded hover:shadow py-2">
            <Link
              className={
                pathname == "/user-list"
                  ? "flex bg-blue-500 py-2 rounded"
                  : "flex"
              }
              href={"/user-list"}>
              <Users width={100} height={30} />
              <span className="text-sm">Users</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li className="mb-2 flex rounded hover:shadow py-2">
            <Link
              className={
                pathname == "/restaurant-list"
                  ? "flex bg-blue-500 py-2 rounded"
                  : "flex"
              }
              href={"/restaurant-list"}>
              <Hotel width={100} height={30} />
              <span className="text-sm">Restaurants</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li className="mb-2 flex rounded hover:shadow py-2">
            <Link
              className={
                pathname == "/taxFee-list"
                  ? "flex bg-blue-500 py-2 rounded"
                  : "flex"
              }
              href={"/taxFee-list"}>
              <Percent width={100} height={30} />
              <span className="text-sm">Tax & Fees</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li className="mb-2 flex rounded hover:shadow py-2">
            <Link
              className={
                pathname == "/menu-category-list"
                  ? "flex bg-blue-500 py-2 rounded"
                  : "flex"
              }
              href={"/menu-category-list"}>
              <Menu width={100} height={30} />
              <span className="text-sm">Menu Categories</span>
            </Link>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li className="mb-2 flex rounded hover:shado py-2">
            <Link
              className={
                pathname == "/food-item-list"
                  ? "flex bg-blue-500 py-2 rounded"
                  : "flex"
              }
              href={"/food-item-list"}>
              <Utensils width={100} height={30} />
              <span className="text-sm">Food Items</span>
            </Link>
          </li>
        )}
      </ul>
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 flex rounded hover:shadow py-2">
          <Link
            className={
              pathname == "/profile" ? "flex bg-blue-500 py-2 rounded" : "flex"
            }
            href={"/profile"}>
            <User width={100} height={30} />
            <span className="text-sm">Profile</span>
          </Link>
        </li>
        <li className="mb-2 flex rounded hover:shadow py-2">
          <Link
            className={
              pathname == "/change-password"
                ? "flex bg-blue-500 py-2 rounded"
                : "flex"
            }
            href={"/change-password"}>
            <Key width={100} height={30} />
            <span className="text-sm">Change Password</span>
          </Link>
        </li>
        <li
          className="mb-2 flex rounded hover:shadow py-2"
          onClick={() => logout()}>
          <LogOut width={120} height={30} />
          <span className="text-sm">Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
