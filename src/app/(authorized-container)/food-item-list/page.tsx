"use client";

import axiosFetch from "@/app/axios.interceptor";
import Pagination from "@/components/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const entriesPerPageOptions = [5, 10, 15];
const baseUrl = "http://localhost:3000";

const FoodItemList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsLimit, setItemsLimit] = useState(5);
  const [totalFoodItems, setTotalFoodItems] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    getFoodItems();

    return () => {
      debouncedUserResults.cancel();
    };
  }, [currentPage, itemsLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getFoodItems = async () => {
    try {
      const response = await axiosFetch.get(
        `api/v1/food-items?page=${currentPage}&limit=${itemsLimit}&search=${debouncedSearchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.data.count != 0) {
        setFoodItems(response.data.result);
        setTotalFoodItems(response.data.count);
        const totalPages = Math.ceil(response.data.count / itemsLimit);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (foodItemId: number) => {
    try {
      const toDelete = confirm(
        "Are you sure, you want to delete this food item?"
      );
      if (toDelete) {
        const response = await axiosFetch.delete(
          `api/v1/food-items/${foodItemId}`
        );
        if (response.data.success) {
          const updatedFoodItems = foodItems.filter(
            (foodItem: any) => foodItem.id != foodItemId
          );
          setFoodItems(updatedFoodItems);
          setTotalFoodItems(response.data.count);
          toast.success(response.data.message);
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (foodItemId: number) => {
    router.push(`edit-foodItem/${foodItemId}`, { scroll: true });
  };

  const onAddToMenu = async (foodItemId: number) => {
    router.push(`add-to-menu/${foodItemId}`);
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const usersLimit = parseInt(event.target.value);
    setItemsLimit(usersLimit);
    const totalPages = Math.ceil(totalFoodItems! / usersLimit);
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
    console.log(totalFoodItems);
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
      <h1 className="text-4xl text-center text-black">Food Item List</h1>
      <div className="flex justify-end">
        <button
          onClick={() => router.push("add-foodItem")}
          className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-44">
          Add New Food Item
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
                Restaurants <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th
                onClick={() => handleSortByAndOrder("phoneNumber")}
                className="px-5 py-4 text-sm text-white font-bold">
                Categories <span className="cursor-pointer text-lg">↕️</span>
              </th>
              <th className="px-5 py-4 text-sm text-white font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {foodItems!.map((foodItem: any) => (
              <tr key={foodItem.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{foodItem.name}</td>
                <td className="px-4 py-3">
                  {foodItem.restaurants.length == 1
                    ? foodItem.restaurants[0].name
                    : foodItem.restaurants.length}
                </td>
                <td className="px-4 py-3">
                  {foodItem.categories.length == 1
                    ? foodItem.categories[0].name
                    : foodItem.categories.length}
                </td>
                <td className="flex">
                  <span className="px-4 py-3">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => onUpdate(foodItem.id)}
                    />
                  </span>
                  {/* <span className="px-4 py-3">
                    <Trash
                      className="cursor-pointer"
                      onClick={() => onDelete(foodItem.id)}
                    />
                  </span> */}
                  <span>
                    <button
                      onClick={() => onAddToMenu(foodItem.id)}
                      className="bg-black text-white rounded-md p-2 m-1">
                      Add To Menu
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalFoodItems}
        usersLimit={itemsLimit}
        currentPage={currentPage}
        entriesPerPageOptions={entriesPerPageOptions}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default FoodItemList;