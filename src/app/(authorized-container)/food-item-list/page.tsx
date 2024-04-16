"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FoodItemListColumns, { FoodItemListColumnsProps } from "./columns";
import { FoodItemRequestApi, FoodItemsApi } from "@/swagger";
import LimitPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";
import HeaderTitle from "@/components/ui/HeaderTitle/HeaderTitle";

const entriesPerPageOptions = [5, 10, 15];

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
      const foodItemsApi = new FoodItemsApi();
      const response = await foodItemsApi.findFoodItems({
        limit: itemsLimit,
        page: currentPage,
        search: debouncedSearchQuery,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
      const foodItems: [] = response.data?.rows as [];
      setFoodItems(foodItems);
      setTotalFoodItems(response.data?.count);
      const totalPages = Math.ceil(response.data?.count! / itemsLimit);
      setTotalPages(totalPages);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onDelete = async (foodItemId: number) => {
    try {
      const toDelete = confirm(
        "Are you sure, you want to delete this food item?"
      );
      if (toDelete) {
        const foodItemsRequestApi = new FoodItemRequestApi();
        const response = await foodItemsRequestApi.deleteFoodItemById({
          id: foodItemId,
        });
        if (response.data?.success) {
          const updatedFoodItems = foodItems.filter(
            (foodItem: any) => foodItem.id != foodItemId
          );
          setFoodItems(updatedFoodItems);
          setTotalFoodItems(response.data.count);
          setCurrentPage(1);
          toast.success(response.data.message);
        }
      }
      return;
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onUpdate = async (foodItemId: number) => {
    router.push(`edit-foodItem/${foodItemId}`, { scroll: true });
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
  const foodItemsColProps: FoodItemListColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };
  return (
    <div className="min-h-screen">
      <HeaderTitle title="Food Item List"></HeaderTitle>

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
            <LimitPerPage
              usersLimit={itemsLimit}
              handleEntriesPerPageChange={handleEntriesPerPageChange}
              entriesPerPageOptions={entriesPerPageOptions}></LimitPerPage>
          </div>

          <button
            onClick={() => router.push("add-foodItem")}
            className="bg-[#EBA232] hover:bg-[#EBA232] rounded-[8px] lg:w-40 w-28 py-4">
            <a className=" text-white lg:text-sm text-xs">Add Food Item</a>
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-lg m-5">
        <table className="bg-white text-left text-xs text-gray-600 w-full">
          <thead className="bg-[#0F172A]">
            <FoodItemListColumns {...foodItemsColProps} />
          </thead>
          <tbody>
            {foodItems?.length != 0 &&
              foodItems?.map((foodItem: any) => (
                <tr
                  key={foodItem.id}
                  className="hover:bg-[#F4F5F7] border-b border-[#f5f5f5]">
                  <td className="px-3">{foodItem.name}</td>
                  <td className="px-2">{foodItem.price}</td>
                  <td className="px-2">
                    {foodItem.restaurants.length == 1
                      ? foodItem.restaurants[0].name
                      : foodItem.restaurants.length}
                  </td>
                  <td className="px-2">
                    {foodItem.categories.length == 1
                      ? foodItem.categories[0].name
                      : foodItem.categories.length}
                  </td>

                  <td className="py-3">
                    <div className="flex flex-row items-center">
                      <span className="px-1">
                        <Pencil
                          size={15}
                          color="black"
                          className="cursor-pointer"
                          onClick={() => onUpdate(foodItem.id)}
                        />
                      </span>
                      <span className="px-4 py-3">
                        <Trash
                          size={15}
                          color="black"
                          className="cursor-pointer"
                          onClick={() => onDelete(foodItem.id)}
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
        totalUsers={totalFoodItems}
        currentPage={currentPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default FoodItemList;
