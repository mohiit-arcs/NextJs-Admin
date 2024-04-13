import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ordersColumns = [
  { field: "status", label: "Order Status", sortable: true },
  { field: "amount", label: "Order Amount", sortable: true },
  { field: "taxAmount", label: "Order Tax Amount", sortable: true },
  { field: "items", label: "Order Item Count", sortable: false },
  { field: "user", label: "Customer Name", sortable: false },
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
      return sortOrder === "asc" ? <ChevronUp className="h-[12px]"/> : <ChevronDown className="h-[12px]"/>;
    }
    return (
      <>
        <ChevronUp className="h-[12px]"/>
        <ChevronDown className="h-[12px] -mt-1"/>
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
            className="py-4 px-3  cursor-pointer text-sm text-white font-bold">
              <div className="flex flex-row items-center">
                {column.label}{" "}
                {column.sortable ? (
                  <span className="text-sm">{getArrowIcon(column.field)}</span>
                ) : null}
              </div>
          </th>
        );
      })}
    </tr>
  );
};

export default OrdersListColumns;
