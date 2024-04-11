"use client";

import { Restaurant, User } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import UserColumns, { OrdersListColumnsProps } from "./columns";
import { OrdersApi, OrdersListResponse } from "@/swagger";
import { useRestaurantContext } from "@/contexts/restaurant/RestaurantContext";
import LimiPerPage from "@/components/ui/table/pagination/limitPerPage/limitPerPage";

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
      ordersApi
        .findOrdersByRestaurantId({
          limit: ordersLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
          restaurantId: defaultRestuarant?.id,
        })
        .then((response: OrdersListResponse) => {
          const orders = response.data?.rows as [];
          setOrders(orders);
          setTotalOrders(response.data?.count);
          const totalPages = Math.ceil(response.data?.count! / ordersLimit);
          setTotalPages(totalPages);
        });
    } catch (error) {
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
      <div className="py-8">
        <h1 className="text-4xl font-bold text-center text-black">
          Orders List
        </h1>
      </div>

      <div className="flex justify-end items-center p-5">
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

      <div className="text-right pr-6">
        <LimiPerPage
          usersLimit={ordersLimit}
          handleEntriesPerPageChange={handleEntriesPerPageChange}
          entriesPerPageOptions={entriesPerPageOptions}></LimiPerPage>
      </div>

      <div className="rounded-lg border border-gray-200 drop-shadow-xl m-5">
        <table className="w-full rounded-md border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-500">
            <UserColumns {...orderColProps} />
          </thead>
          <tbody>
            {orders &&
              orders!.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-200">
                  <td className="px-4 py-3">{_.capitalize(order.status)}</td>
                  <td className="px-4 py-3">{order.amount}</td>
                  <td className="px-4 py-3">{order.taxAmount}</td>
                  <td className="px-4 py-3">{order.orderItems.length}</td>
                  <td className="px-4 py-3">{order.user.name}</td>
                  <td className="flex">
                    <span className="px-4 py-3">
                      <Pencil className="cursor-pointer" />
                    </span>
                    {/* <span className="px-4 py-3">
                      <Trash
                        className="cursor-pointer"
                        onClick={() => onDelete(order.id)}
                      />
                    </span> */}
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
