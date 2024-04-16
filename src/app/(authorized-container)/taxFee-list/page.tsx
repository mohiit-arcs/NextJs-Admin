"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaxFeeColumnsListColumns, { FoodItemListColumnsProps } from "./column";
import { TaxFeeApi, TaxFeeRequestApi } from "@/swagger";
import { TaxFee } from "@prisma/client";
import { useRestaurantContext } from "@/contexts/restaurant/RestaurantContext";
import LimiPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";
import ListingHeader from "@/components/ui/HeaderTitle/HeaderTitle";

const entriesPerPageOptions = [5, 10, 15];

const TaxFeeList = () => {
  const { defaultRestuarant } = useRestaurantContext();
  const [taxFee, setTaxFee] = useState<TaxFee[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [taxFeeLimit, setTaxFeeLimit] = useState(5);
  const [totalTaxFee, setTotalTaxFee] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    getTaxFee();
    return () => {
      debouncedUserResults.cancel();
    };
  }, [
    currentPage,
    taxFeeLimit,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    defaultRestuarant,
  ]);

  const getTaxFee = async () => {
    try {
      const taxFeeApi = new TaxFeeApi();
      const response = await taxFeeApi.findTaxFee({
        limit: taxFeeLimit,
        page: currentPage,
        search: debouncedSearchQuery,
        sortBy: sortBy,
        sortOrder: sortOrder,
        restaurantId: defaultRestuarant?.id,
      });
      const taxFee = response.data?.rows as TaxFee[];
      setTaxFee(taxFee);
      setTotalTaxFee(response.data?.count);
      const totalPages = Math.ceil(response.data?.count! / taxFeeLimit);
      setTotalPages(totalPages);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onUpdate = async (taxFeeId: number) => {
    router.push(`edit-taxfee/${taxFeeId}`, { scroll: true });
  };

  const onDelete = async (restaurantId: number) => {
    try {
      const toDelete = confirm(
        "Are you sure, you want to delete this Tax Fee?"
      );
      if (toDelete) {
        const taxFeeRequestApi = new TaxFeeRequestApi();
        const response = await taxFeeRequestApi.deleteTaxFeeById({
          id: restaurantId,
        });
        if (response.data?.success) {
          const updatedTaxFee = taxFee?.filter(
            (restaurant) => restaurant.id != restaurantId
          );
          setTaxFee(updatedTaxFee);
          setTotalTaxFee(response.data?.count);
          toast.success(response.data?.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const usersLimit = parseInt(event.target.value);
    setTaxFeeLimit(usersLimit);
    const totalPages = Math.ceil(totalTaxFee! / usersLimit);
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
    console.log(totalTaxFee);
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

  const foodItemListColProps: FoodItemListColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };
  return (
    <div className="min-h-screen">
      <ListingHeader title="Tax & Fee List"></ListingHeader>

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
              usersLimit={taxFeeLimit}
              handleEntriesPerPageChange={handleEntriesPerPageChange}
              entriesPerPageOptions={entriesPerPageOptions}
            ></LimiPerPage>
          </div>

          <button
            onClick={() => router.push("add-taxfee")}
            className="bg-[#EBA232] hover:bg-[#EBA232] rounded-[8px] lg:w-40 w-28 py-4"
          >
            <a className=" text-white lg:text-sm text-xs">Add new tax fee</a>
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-lg m-5">
        <table className="bg-white text-left text-xs text-gray-600 w-full">
          <thead className="bg-[#0F172A]">
            <TaxFeeColumnsListColumns {...foodItemListColProps} />
          </thead>
          <tbody>
            {taxFee?.map((item: any) => (
              <tr
                key={item.id}
                className="hover:bg-[#F4F5F7] border-b border-[#D8D9DB]">
                <td className="px-2">{item.taxName}</td>
                <td className="px-2">{_.capitalize(item.taxType)}</td>
                <td className="px-2">{item.value}</td>
                <td className="py-3">
                  <div className="flex flex-row items-center">
                    <span className="px-1">
                      <Pencil
                        size={15}
                        color="black"
                        className="cursor-pointer"
                        onClick={() => onUpdate(item.id)}
                      />
                    </span>

                    <span className="px-1">
                      <Trash
                        size={15}
                        color="black"
                        className="cursor-pointer"
                        onClick={() => onDelete(item.id)}
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
        totalUsers={totalTaxFee}
        currentPage={currentPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default TaxFeeList;
