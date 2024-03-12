"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Pagination from "@/components/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";

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
      const response = await axios.get(
        `api/v1/users?page=${currentPage}&limit=${usersLimit}&search=${debouncedSearchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.data.count != 0) {
        setUsers(response.data.result);
        setTotalUsers(response.data.count);
        const totalPages = Math.ceil(response.data.count / usersLimit);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (userId: number) => {
    try {
      const toDelete = confirm("Are you sure, you want to delete the user?");
      if (toDelete) {
        const response = await axios.delete(`api/v1/users/${userId}`);
        if (response.data.data?.success) {
          const updatedUsers = users.filter((user) => user.id != userId);
          setUsers(updatedUsers);
          setTotalUsers(response.data.data.count);
          toast.success(response.data.data.message);
        }
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

  const handleSortByAndOrder = (sortBy: string) => {
    if (sortBy != sortBy) {
      setSortBy(sortBy);
    }
    if (sortOrder == "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">User List</h1>
      <div className="flex justify-end">
        <button
          onClick={() => router.push("add-user")}
          className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-40">
          Add New User
        </button>
        <div className="relative mb-2 w-[400px] mr-6">
          <input
            type="text"
            className="m-0 block h-[58px] w-full rounded shadow-lg border-2 border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black"
            placeholder="Search here..."
            value={searchQuery}
            // onChange={(e) => debouncedUserResults(e)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 drop-shadow-xl m-5">
        <table className="w-full rounded-md border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-500">
            <tr>
              <th
                onClick={() => handleSortByAndOrder("name")}
                className="px-5 py-4 text-sm text-white font-bold">
                Name <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("email")}
                className="px-5 py-4 text-sm text-white font-bold">
                Email <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("role")}
                className="px-5 py-4 text-sm text-white font-bold">
                Role <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th className="px-5 py-4 text-sm text-white font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users!.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role.name}</td>
                <td className="flex">
                  <span className="px-4 py-3">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => onUpdate(user.id)}
                    />
                  </span>
                  <span className="px-4 py-3">
                    <Trash
                      className="cursor-pointer"
                      onClick={() => onDelete(user.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalUsers}
        usersLimit={usersLimit}
        currentPage={currentPage}
        entriesPerPageOptions={entriesPerPageOptions}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default UserList;
