"use client";

import { User } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import _ from "lodash";
import Pagination from "@/components/ui/table/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import UserColumns from "./columns";
import { OrdersApi, OrdersListResponse } from "@/swagger";

const entriesPerPageOptions = [5, 10, 15];

const UserList = () => {
  const { id } = useParams();
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
  }, [currentPage, ordersLimit, debouncedSearchQuery, sortBy, sortOrder]);

  const getOrders = async () => {
    try {
      const ordersApi = new OrdersApi();
      ordersApi
        .findOrdersByRestaurantId({
          id: Number(id),
          limit: ordersLimit,
          page: currentPage,
          search: debouncedSearchQuery,
          sortBy: sortBy,
          sortOrder: sortOrder,
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

  //   const onDelete = async (orderId: number) => {
  //     try {
  //       const toDelete = confirm("Are you sure, you want to delete the order?");
  //       if (toDelete) {
  //         const userRequestApi = new UserRequestApi();
  //         userRequestApi
  //           .deleteUserById({
  //             id: orderId,
  //           })
  //           .then((response: UserDeleteResponse) => {
  //             if (response.data?.success) {
  //               const updatedUsers = orders.filter((order) => order.id != orderId);
  //               setOrders(updatedUsers);
  //               setTotalOrders(response.data.count);
  //               toast.success(response.data.message);
  //             }
  //           });
  //       }
  //       return;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">Orders List</h1>
      <div className="flex justify-end">
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
            <UserColumns handleSortByAndOrder={handleSortByAndOrder} />
          </thead>
          <tbody>
            {orders &&
              orders!.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-200">
                  <td className="px-4 py-3">{_.capitalize(order.status)}</td>
                  <td className="px-4 py-3">{order.amount}</td>
                  <td className="px-4 py-3">{order.taxAmount}</td>
                  <td className="px-4 py-3">{order.items}</td>
                  <td className="px-4 py-3">{order.user.name}</td>
                  <td className="px-4 py-3">{order.restaurant.name}</td>
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
        usersLimit={ordersLimit}
        currentPage={currentPage}
        entriesPerPageOptions={entriesPerPageOptions}
        handleEntriesPerPageChange={handleEntriesPerPageChange}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default UserList;
