"use client";

import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import RestaurantColumns from "./columns";
import {
  RestaurantDeleteResponse,
  RestaurantListResponse,
  RestaurantRequestApi,
  RestaurantsApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";

const entriesPerPageOptions = [5, 10, 15];
const baseUrl = "http://localhost:3000";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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
    getRestaurants();

    return () => {
      // debouncedUserResults.cancel();
    };
  }, [currentPage, restaurantsLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getRestaurants = async () => {
    try {
      const restaurantListApi = new RestaurantsApi();
      restaurantListApi
        .findRestaurants({
          limit: restaurantsLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
        })
        .then((response: RestaurantListResponse) => {
          const restaurants = response.data?.rows as Restaurant[];
          setRestaurants(restaurants);
          setTotalRestaurants(response.data?.count);
          const totalPages = Math.ceil(
            response.data?.count! / restaurantsLimit
          );
          setTotalPages(totalPages);
        });
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
        const resturantRequestApi = new RestaurantRequestApi();
        resturantRequestApi
          .deleteRestaurantById({ id: restaurantId })
          .then((response: RestaurantDeleteResponse) => {
            if (response.data?.success) {
              const updatedRestaurants = restaurants.filter(
                (restaurant) => restaurant.id != restaurantId
              );
              setRestaurants(updatedRestaurants);
              setTotalRestaurants(response.data?.count);
              toast.success(response.data?.message);
            }
          });
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
            <RestaurantColumns handleSortByAndOrder={handleSortByAndOrder} />
          </thead>
          <tbody>
            {restaurants!.map((restaurant: any) => (
              <tr key={restaurant.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">
                  <span
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      router.push(`/restaurant-info/${restaurant.id}`, {
                        scroll: true,
                      })
                    }>
                    {restaurant.name}
                  </span>
                </td>
                <td className="px-4 py-3">{restaurant.email}</td>
                <td className="px-4 py-3">{restaurant.phoneNumber}</td>
                <td className="px-4 py-3">{restaurant.street}</td>
                <td className="px-4 py-3">{restaurant.city}</td>
                <td className="px-4 py-3">{restaurant.zipcode}</td>
                <td className="px-4 py-3">{restaurant.state}</td>
                <td className="px-4 py-3">{restaurant.country}</td>
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
                  <span className="px-4 py-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md"
                      type="button"
                      onClick={() =>
                        router.push(`order-list/${restaurant.id}`)
                      }>
                      View Orders
                    </button>
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

export default RestaurantList;
