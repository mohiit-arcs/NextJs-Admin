"use client";

import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import _ from "lodash";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaxFeeColumnsListColumns from "./column";
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
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">Tax and Fee List</h1>
      <div className="flex justify-end">
        <button
          onClick={() => router.push("add-taxfee")}
          className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-44">
          Add New Tax Fee
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
            <TaxFeeColumnsListColumns
              handleSortByAndOrder={handleSortByAndOrder}
            />
          </thead>
          <tbody>
            {taxFee?.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{item.taxName}</td>
                <td className="px-4 py-3">{_.capitalize(item.taxType)}</td>
                <td className="px-4 py-3">{item.value}</td>
                <td className="px-4 py-3">{item.restaurant.name}</td>
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
