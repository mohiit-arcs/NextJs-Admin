import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ordersColumns = [
  { field: "status", label: "Order Status", sortable: true },
  { field: "amount", label: "Order Amount", sortable: true },
  { field: "taxAmount", label: "Order Tax Amount", sortable: true },
  { field: "items", label: "Order Item Count", sortable: false },
  { field: "user", label: "Customer Name", sortable: false },
  { field: "restaurant", label: "Restaurant Name", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

export interface OrdersListColumnsProps {
  handleSortByAndOrder: (field: string) => void;
  sortBy: string;
  sortOrder: string;
}

const OrdersListColumns: React.FC<OrdersListColumnsProps> = ({
  sortBy,
  sortOrder,
  handleSortByAndOrder,
}) => {
  const getArrowIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />;
    }
    return (
      <>
        <ChevronUp />
        <ChevronDown />
      </>
    );
  };
  return (
    <tr>
      {ordersColumns.map((column) => {
        return (
          <th
            onClick={() =>
              column.sortable && handleSortByAndOrder(column.field)
            }
            key={column.field}
            className="px-5 cursor-pointer py-4 text-sm text-white font-bold">
            {column.label}{" "}
            {column.sortable ? (
              <span className="text-lg">{getArrowIcon(column.field)}</span>
            ) : null}
          </th>
        );
      })}
    </tr>
  );
};

export default OrdersListColumns;
