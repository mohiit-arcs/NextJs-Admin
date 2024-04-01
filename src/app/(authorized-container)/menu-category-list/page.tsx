"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuCategoryListColumns from "./column";
import { MenuCategoryApi, MenuCategoryListResponse } from "@/swagger";

const entriesPerPageOptions = [5, 10, 15];

const MenuCategoryList = () => {
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
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">Menu Category List</h1>
      <div className="flex justify-end">
        <button
          onClick={() => router.push("add-menu-category")}
          className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-44">
          Add New Menu Category
        </button>
        <div className="relative mb-2 w-[400px] mr-6">
          <input
            type="text"
            className="m-0 block h-[58px] w-full rounded shadow-lg border-2 border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 drop-shadow-xl m-5">
        <table className="w-full rounded-md border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-500">
            <MenuCategoryListColumns
              handleSortByAndOrder={handleSortByAndOrder}
            />
          </thead>
          <tbody>
            {menuCategories!.map((menuCategory: any) => (
              <tr key={menuCategory.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{menuCategory.name}</td>
                <td className="px-4 py-3">{menuCategory.restaurant.name}</td>
                <td className="flex">
                  <span className="px-4 py-3">
                    <Pencil
                      className="cursor-pointer"
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
        usersLimit={menuCategoriesLimit}
        currentPage={currentPage}
        entriesPerPageOptions={entriesPerPageOptions}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default MenuCategoryList;
