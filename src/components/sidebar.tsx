import {
  Hotel,
  Key,
  LayoutDashboardIcon,
  LogOut,
  User,
  Users,
  Utensils,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "./user-profile/page";
import { RoleSlug } from "@prisma/client";
import { setAuthToken } from "@/services/frontend/storage.service";

const Sidebar = () => {
  const router = useRouter();
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
        <li
          className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
          onClick={() => router.push("dashboard")}>
          <LayoutDashboardIcon width={100} height={30} />
          <span className="text-sm">Dashboard</span>
        </li>
        {userProfile?.role?.slug == RoleSlug.superAdmin && (
          <li
            className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
            onClick={() => router.push("user-list")}>
            <Users width={100} height={30} />
            <span className="text-sm">Users</span>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li
            className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
            onClick={() => router.push("restaurant-list")}>
            <Hotel width={100} height={30} />
            <span className="text-sm">Restaurants</span>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li
            className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
            onClick={() => router.push("menu-category-list")}>
            <Menu width={100} height={30} />
            <span className="text-sm">Menu Categories</span>
          </li>
        )}
        {userProfile?.role?.slug == RoleSlug.restaurantAdmin && (
          <li
            className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
            onClick={() => router.push("food-item-list")}>
            <Utensils width={100} height={30} />
            <span className="text-sm">Food Items</span>
          </li>
        )}
      </ul>
      <ul className="mt-3 text-white font-bold">
        <li
          className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
          onClick={() => router.push("profile")}>
          <User width={100} height={30} />
          <span className="text-sm">Profile</span>
        </li>
        <li
          className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
          onClick={() => router.push("change-password")}>
          <Key width={100} height={30} />
          <span className="text-sm">Change Password</span>
        </li>
        <li
          className="mb-2 flex rounded hover:shadow hover:bg-blue-500 py-2"
          onClick={() => logout()}>
          <LogOut width={120} height={30} />
          <span className="text-sm">Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
