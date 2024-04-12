"use client";

import { User } from "@prisma/client";
import { Pencil, Search, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import UserColumns, { UserColumnsProps } from "./columns";
import {
  UserDeleteResponse,
  UserListResponse,
  UserRequestApi,
  UsersApi,
} from "@/swagger";
import LimiPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";

const entriesPerPageOptions = [5, 10, 15];

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(5);
  const [totalUsers, setTotalUsers] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    getUsers();

    return () => {
      // debouncedUserResults.cancel();
    };
  }, [currentPage, usersLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getUsers = async () => {
    try {
      const usersAPi = new UsersApi();
      usersAPi
        .findUsers({
          limit: usersLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
        })
        .then((response: UserListResponse) => {
          const users = response.data?.rows as User[];
          setUsers(users);
          setTotalUsers(response.data?.count);
          const totalPages = Math.ceil(response.data?.count! / usersLimit);
          setTotalPages(totalPages);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (userId: number) => {
    try {
      const toDelete = confirm("Are you sure, you want to delete the user?");
      if (toDelete) {
        const userRequestApi = new UserRequestApi();
        userRequestApi
          .deleteUserById({
            id: userId,
          })
          .then((response: UserDeleteResponse) => {
            if (response.data?.success) {
              const updatedUsers = users.filter((user) => user.id != userId);
              setUsers(updatedUsers);
              setTotalUsers(response.data.count);
              toast.success(response.data.message);
            }
          });
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (userId: number) => {
    router.push(`/update-user/${userId}`, { scroll: true });
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const usersLimit = parseInt(event.target.value);
    setUsersLimit(usersLimit);
    const totalPages = Math.ceil(totalUsers! / usersLimit);
    setTotalPages(totalPages);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    console.log(totalUsers);
    if (currentPage < totalPages!) {
      setCurrentPage(currentPage + 1);
    }
  };

  const debouncedUserResults = useMemo(() => {
    return _.debounce((e) => {
      setCurrentPage(e.target.value);
    }, 500);
  }, []);

  const handleSortByAndOrder = (newSortBy: string) => {
    if (sortBy != newSortBy) {
      setSortBy(newSortBy);
    }
    if (sortOrder == "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  const userColProps: UserColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };

  return (

    <div className="min-h-screen">


      <div className="py-4 flex justify-start pl-5 border-b border-[#DDDDDD]">
        <h1 className="text-4xl font-bold text-center text-[#0F172A]">
          User List
        </h1>
      </div>


      <div className="flex sm:flex-row flex-col sm:justify-between justify-center items-center px-5 mt-8">

          <div className="flex items-center relative lg:w-[400px] sm:w-[250px] w-full sm:mr-6 mr-0 sm:mb-2 mb-8">
    
          <Search
            color="#dddddd"
            size={18}
            className="mx-3 mb-1 absolute focus:text-[#EBA232]"
          />
          
          <input
            type="text"
            className="rounded-full bg-[#FFFFFF] px-9 py-4 text-sm text-gray-800 border border-[#dddddd] w-full 
            placeholder-[#dddddd] placeholder:text-sm
            focus:border-[#f5f5f5] focus:outline-none"
            placeholder="Search here..."
            value={searchQuery}
            // onChange={(e) => debouncedUserResults(e)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          </div>
    
          <div className="flex sm:flex-row flex-col items-center">

        <div className="text-right text-xs pr-6 sm:mb-0 mb-8">
          <LimiPerPage
            usersLimit={usersLimit}
            handleEntriesPerPageChange={handleEntriesPerPageChange}
            entriesPerPageOptions={entriesPerPageOptions}></LimiPerPage>
        </div>

        <button
          onClick={() => router.push("add-user")}
          className="bg-[#EBA232] hover:bg-[#EBA232] rounded-[8px] lg:w-28 w-20 py-4">
          <a className=" text-white lg:text-sm text-xs">Add User</a>
        </button>

      </div>

       

      </div>

      

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-lg m-5">

        <table className="bg-white text-left text-xs text-gray-600 w-full">

          <thead className="bg-[#0F172A]">
            <UserColumns {...userColProps} />
          </thead>

          <tbody>
            {users &&
              users!.map((user: any) => (
                <tr key={user.id} className="hover:bg-[#F4F5F7] border-b border-[#f5f5f5]">
                  <td className="px-2">{user.name}</td>
                  <td className="px-2">{user.email}</td>
                  <td className="px-2">{user.role.name}</td>

                  <td className="py-3">

                  <div className="flex flex-row items-center">

                    <span className="px-1">
                      <Pencil
                        size={15}
                        color="black"
                        className="cursor-pointer"
                        onClick={() => onUpdate(user.id)}
                      />
                    </span>

                    <span className="px-1">
                      <Trash
                        size={15}
                        color="black"
                        className="cursor-pointer"
                        onClick={() => onDelete(user.id)}
                      />
                    </span>

                  </div>

                  </td>

                </tr>
              ))}
          </tbody>

        </table>
      </div>

      <Pagination
        totalUsers={totalUsers}
        currentPage={currentPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default UserList;
