"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuCategoryListColumns, { FoodItemListColumnsProps } from "./column";
import { MenuCategoryApi, MenuCategoryListResponse } from "@/swagger";
import { useRestaurantContext } from "@/contexts/restaurant/RestaurantContext";
import LimiPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";
import ListingHeader from "@/components/ui/HeaderTitle/HeaderTitle";

const entriesPerPageOptions = [5, 10, 15];

const MenuCategoryList = () => {
  const { defaultRestuarant } = useRestaurantContext();
  const [menuCategories, setMenuCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuCategoriesLimit, setMenuCategoriesLimit] = useState(5);
  const [totalMenuCategories, setTotalMenuCategories] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    getMenuCategories();

    return () => {
      debouncedUserResults.cancel();
    };
  }, [
    currentPage,
    menuCategoriesLimit,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    defaultRestuarant,
  ]);

  const getMenuCategories = async () => {
    try {
      const menuCategoriesApi = new MenuCategoryApi();
      menuCategoriesApi
        .findMenuCategories({
          limit: menuCategoriesLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
          restaurantId: defaultRestuarant?.id,
        })
        .then((response: MenuCategoryListResponse) => {
          const menuCategories: [] = response.data?.rows as [];
          setMenuCategories(menuCategories);
          setTotalMenuCategories(response.data?.count);
          const totalPages = Math.ceil(
            response.data?.count! / menuCategoriesLimit
          );
          setTotalPages(totalPages);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (menuCategoryId: number) => {
    router.push(`edit-menu-category/${menuCategoryId}`, { scroll: true });
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const usersLimit = parseInt(event.target.value);
    setMenuCategoriesLimit(usersLimit);
    const totalPages = Math.ceil(totalMenuCategories! / usersLimit);
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
    console.log(totalMenuCategories);
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
  const menuCategoryColProps: FoodItemListColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };
  return (
    <div className="min-h-screen">
      <ListingHeader title="Menu Category List"></ListingHeader>

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex sm:flex-row flex-col items-center">
          <div className="text-right text-xs pr-6 sm:mb-0 mb-8">
            <LimiPerPage
              usersLimit={menuCategoriesLimit}
              handleEntriesPerPageChange={handleEntriesPerPageChange}
              entriesPerPageOptions={entriesPerPageOptions}
            ></LimiPerPage>
          </div>

          <button
            onClick={() => router.push("add-menu-category")}
            className="bg-[#EBA232] hover:bg-[#EBA232] rounded-[8px] lg:w-40 w-28 py-4"
          >
            <a className=" text-white lg:text-sm text-xs">Add Menu Cetagory</a>
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-lg m-5">
        <table className="bg-white text-left text-xs text-gray-600 w-full">
          <thead className="bg-[#0F172A]">
            <MenuCategoryListColumns {...menuCategoryColProps} />
          </thead>
          <tbody>
            {menuCategories!.map((menuCategory: any) => (
              <tr
                key={menuCategory.id}
                className="hover:bg-[#F4F5F7] border-b border-[#f5f5f5]"
              >
                <td className="px-3 w-[150px]">{menuCategory.name}</td>

                <td className="">
                  <span className="px-3">
                    <Pencil
                      size={15}
                      color="black"
                      className="cursor-pointer ml-4"
                      onClick={() => onUpdate(menuCategory.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalMenuCategories}
        currentPage={currentPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default MenuCategoryList;
