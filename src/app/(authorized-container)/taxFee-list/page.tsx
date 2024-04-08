"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaxFeeColumnsListColumns, { FoodItemListColumnsProps } from "./column";
import {
  TaxFeeApi,
  TaxFeeDeleteResponse,
  TaxFeeListResponse,
  TaxFeeRequestApi,
} from "@/swagger";
import { TaxFee } from "@prisma/client";

const entriesPerPageOptions = [5, 10, 15];

const TaxFeeList = () => {
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
  }, [currentPage, taxFeeLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getTaxFee = async () => {
    try {
      const taxFeeApi = new TaxFeeApi();
      taxFeeApi
        .findTaxFee({
          limit: taxFeeLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
        })
        .then((response: TaxFeeListResponse) => {
          const taxFee = response.data?.rows as TaxFee[];
          setTaxFee(taxFee);
          setTotalTaxFee(response.data?.count);
          const totalPages = Math.ceil(response.data?.count! / taxFeeLimit);
          setTotalPages(totalPages);
        });
    } catch (error) {
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
        taxFeeRequestApi
          .deleteTaxFeeById({ id: restaurantId })
          .then((response: TaxFeeDeleteResponse) => {
            if (response.data?.success) {
              const updatedTaxFee = taxFee?.filter(
                (restaurant) => restaurant.id != restaurantId
              );
              setTaxFee(updatedTaxFee);
              setTotalTaxFee(response.data?.count);
              toast.success(response.data?.message);
            }
          });
      }
      return;
    } catch (error) {
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
      <div className="py-8">
        <h1 className="text-4xl font-bold text-center text-black">
          Tax and Fee List
        </h1>
      </div>

      <div className="flex justify-between items-center p-5">
        <button
          onClick={() => router.push("add-taxfee")}
          className="bg-[#EBA232] hover:bg-[#EBA232] rounded-full w-40 py-4">
          <a href="" className=" text-white text-sm">
            Add new tax fee
          </a>
        </button>

        <div className="flex items-center relative mb-2 w-[400px] mr-6">
          <input
            type="text"
            className="rounded-full bg-[#FFFFFF] px-9 py-4 text-sm text-[#EBA232] border border-[#EBA232] w-full 
            placeholder-[#EBA232] placeholder:text-sm
            focus:border-[#EBA232] focus:outline-none"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-sm m-5">
        <table className="bg-white text-left text-xs text-gray-500">
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
                <td className="px-2">{item.restaurant.name}</td>
                <td className="flex">
                  <span className="px-4 py-3">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => onUpdate(item.id)}
                    />
                  </span>
                  <span className="px-4 py-3">
                    <Trash
                      className="cursor-pointer"
                      onClick={() => onDelete(item.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalTaxFee}
        usersLimit={taxFeeLimit}
        currentPage={currentPage}
        entriesPerPageOptions={entriesPerPageOptions}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default TaxFeeList;
