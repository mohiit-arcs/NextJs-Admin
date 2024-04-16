"use client";

import { User } from "@prisma/client";
import { Pencil, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import UserColumns, { OrdersListColumnsProps } from "./columns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrdersApi } from "@/swagger";
import { useRestaurantContext } from "@/contexts/restaurant/RestaurantContext";
import LimiPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";
import ListingHeader from "@/components/ui/HeaderTitle/HeaderTitle";

const entriesPerPageOptions = [5, 10, 15];

const UserList = () => {
  const { defaultRestuarant, setDefaultRestaurant } = useRestaurantContext();
  const [orders, setOrders] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersLimit, setOrdersLimit] = useState(5);
  const [totalOrders, setTotalOrders] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    getOrders();

    return () => {
      // debouncedUserResults.cancel();
    };
  }, [
    currentPage,
    ordersLimit,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    defaultRestuarant,
  ]);

  const getOrders = async () => {
    try {
      const ordersApi = new OrdersApi();
      const response = await ordersApi.findOrdersByRestaurantId({
        limit: ordersLimit,
        page: currentPage,
        search: debouncedSearchQuery,
        sortBy: sortBy,
        sortOrder: sortOrder,
        restaurantId: defaultRestuarant?.id,
      });
      const orders = response.data?.rows as [];
      setOrders(orders);
      setTotalOrders(response.data?.count);
      const totalPages = Math.ceil(response.data?.count! / ordersLimit);
      setTotalPages(totalPages);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onUpdate = async (userId: number) => {
    router.push(`/update-user/${userId}`, { scroll: true });
  };

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ordersLimit = parseInt(event.target.value);
    setOrdersLimit(ordersLimit);
    const totalPages = Math.ceil(totalOrders! / ordersLimit);
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
    console.log(totalOrders);
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

  const orderColProps: OrdersListColumnsProps = {
    handleSortByAndOrder,
    sortBy,
    sortOrder,
  };

  return (
    <div className="min-h-screen">
      <ListingHeader title="Order List"></ListingHeader>

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
          <div className="text-right text-xs pr-6 sm:mb-0">
            <LimiPerPage
              usersLimit={ordersLimit}
              handleEntriesPerPageChange={handleEntriesPerPageChange}
              entriesPerPageOptions={entriesPerPageOptions}
            ></LimiPerPage>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 drop-shadow-lg m-5">
        <table className="bg-white text-left text-xs text-gray-600 w-full">
          <thead className="bg-[#0F172A]">
            <UserColumns {...orderColProps} />
          </thead>

          <tbody>
            {orders &&
              orders!.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#F4F5F7] border-b border-[#f5f5f5]"
                >
                  <td className="px-2">{_.capitalize(order.status)}</td>
                  <td className="px-2">{order.amount}</td>
                  <td className="px-2">{order.taxAmount}</td>
                  <td className="px-2">{order.orderItems.length}</td>
                  <td className="px-2">{order.user.name}</td>

                  <td className="py-3">
                    <div className="flex flex-row items-center">
                      <span className="px-1">
                        <Pencil
                          size={15}
                          color="black"
                          className="cursor-pointer"
                        />
                      </span>
                      {/* <span className="px-4 py-3">
                      <Trash
                        className="cursor-pointer"
                        onClick={() => onDelete(order.id)}
                      />
                    </span> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalUsers={totalOrders}
        currentPage={currentPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default UserList;
