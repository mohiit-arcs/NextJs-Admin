"use client";

import { Pencil, Search, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import RestaurantColumns, { RestaurantColumnsProps } from "./columns";
import {
  RestaurantDeleteResponse,
  RestaurantListResponse,
  RestaurantRequestApi,
  RestaurantsApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import ToolTip from "@/components/ui/tooltip/tooltip";

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

  const restaurantsColProps: RestaurantColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center p-5">
        <button
          onClick={() => router.push("add-restaurant")}
          className="bg-[#EBA232] hover:bg-[#EBA232] rounded-full w-40 py-4">
          <a className=" text-white text-sm">Add Restaurant</a>
        </button>
        <div className="flex items-center relative mb-2 w-[400px] mr-6">
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
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-sm m-5">
        <table className=" bg-white text-left text-xs text-gray-500">
          <thead className="bg-[#0F172A]">
            <RestaurantColumns {...restaurantsColProps} />
          </thead>
          <tbody>
            {restaurants!.map((restaurant: any) => (
              <tr
                onClick={() =>
                  router.push(`/restaurant-info/${restaurant.id}`, {
                    scroll: true,
                  })
                }
                key={restaurant.id}
                className="hover:bg-[#F4F5F7] border-b border-[#f5f5f5]">
                <td className="px-3">
                  <span className="cursor-pointer hover:text-[#0F172A]">
                    {restaurant.name}
                  </span>
                </td>
                <td className="px-2">{restaurant.email}</td>
                <td className="px-2">{restaurant.phoneNumber}</td>
                <td className="px-2">{restaurant.street}</td>
                <td className="px-2">{restaurant.city}</td>
                <td className="px-2">{restaurant.zipcode}</td>
                <td className="px-2">{restaurant.state}</td>
                <td className="px-2">{restaurant.country}</td>
                {/* <td className="px-2">
                  <img
                    className="h-12 w-12 object-cover"
                    src={`${baseUrl}/assets/images/restaurants/thumbnail/${restaurant.image}`}
                    alt=""
                  />
                </td> */}
                <td className="flex items-center py-3">
                  <span className="px-1">
                    <ToolTip tooltip={"Edit Restaurant Details"}>
                      {" "}
                      <Pencil
                        size={15}
                        className="cursor-pointer"
                        onClick={() => onUpdate(restaurant.id)}
                      />
                    </ToolTip>
                  </span>
                  <span className="px-1">
                    <Trash
                      size={15}
                      className="cursor-pointer"
                      onClick={() => onDelete(restaurant.id)}
                    />
                  </span>
                  <span className="px-1">
                    <ShoppingCart
                      size={15}
                      className="cursor-pointer"
                      onClick={() => router.push(`order-list/${restaurant.id}`)}
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

export default RestaurantList;
