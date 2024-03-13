"use client";

import { User } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Pagination from "@/components/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import axiosFetch from "@/app/axios.interceptor";

const entriesPerPageOptions = [5, 10, 15];
const baseUrl = "http://localhost:3000";

const UserList = () => {
  const [restaurants, setRestaurants] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsLimit, setRestaurantsLimit] = useState(5);
  const [totalRestaurants, setTotalRestaurants] = useState<number>();
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
  }, [currentPage, restaurantsLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getUsers = async () => {
    try {
      const response = await axiosFetch.get(
        `api/v1/restaurants?page=${currentPage}&limit=${restaurantsLimit}&search=${debouncedSearchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.data.count != 0) {
        setRestaurants(response.data.data.rows);
        setTotalRestaurants(response.data.data.count);
        const totalPages = Math.ceil(
          response.data.data.count / restaurantsLimit
        );
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (restaurantId: number) => {
    try {
      const toDelete = confirm(
        "Are you sure, you want to delete this restaurant?"
      );
      if (toDelete) {
        const response = await axiosFetch.delete(
          `api/v1/restaurants/${restaurantId}`
        );
        if (response.data.data.success) {
          const updatedUsers = restaurants.filter(
            (restaurant) => restaurant.id != restaurantId
          );
          setRestaurants(updatedUsers);
          setTotalRestaurants(response.data.data.count);
          toast.success(response.data.data.message);
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (restaurantId: number) => {
    router.push(`/update-restaurant/${restaurantId}`, { scroll: true });
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const usersLimit = parseInt(event.target.value);
    setRestaurantsLimit(usersLimit);
    const totalPages = Math.ceil(totalRestaurants! / usersLimit);
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
    console.log(totalRestaurants);
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
      <h1 className="text-4xl text-center text-black">Restaurant List</h1>
      <div className="flex justify-end">
        <button
          onClick={() => router.push("add-restaurant")}
          className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-44">
          Add New Restaurant
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
                onClick={() => handleSortByAndOrder("phoneNumber")}
                className="px-5 py-4 text-sm text-white font-bold">
                Phone Number <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("street")}
                className="px-5 py-4 text-sm text-white font-bold">
                Street <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("city")}
                className="px-5 py-4 text-sm text-white font-bold">
                City <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("zipcode")}
                className="px-5 py-4 text-sm text-white font-bold">
                ZipCode <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("state")}
                className="px-5 py-4 text-sm text-white font-bold">
                State <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("country")}
                className="px-5 py-4 text-sm text-white font-bold">
                Country <span className="cursor-pointer text-lg">↕️</span>
              </th>
              {/* <th className="px-5 py-4 text-sm text-white font-bold">
                Image <span className="cursor-pointer text-lg">↕️</span>
              </th> */}
              <th className="px-5 py-4 text-sm text-white font-bold">Image</th>
              <th className="px-5 py-4 text-sm text-white font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurants!.map((restaurant: any) => (
              <tr key={restaurant.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{restaurant.name}</td>
                <td className="px-4 py-3">{restaurant.email}</td>
                <td className="px-4 py-3">{restaurant.phoneNumber}</td>
                <td className="px-4 py-3">{restaurant.location.street}</td>
                <td className="px-4 py-3">{restaurant.location.city}</td>
                <td className="px-4 py-3">{restaurant.location.zipCode}</td>
                <td className="px-4 py-3">{restaurant.location.state}</td>
                <td className="px-4 py-3">{restaurant.location.country}</td>
                <td className="px-4 py-3">
                  <img
                    className="h-16 object-cover"
                    src={`${baseUrl}/assets/images/restaurants/thumbnail/${restaurant.image}`}
                    alt=""
                  />
                </td>
                <td className="flex">
                  <span className="px-4 py-3">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => onUpdate(restaurant.id)}
                    />
                  </span>
                  <span className="px-4 py-3">
                    <Trash
                      className="cursor-pointer"
                      onClick={() => onDelete(restaurant.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalRestaurants}
        usersLimit={restaurantsLimit}
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
