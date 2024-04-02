import React from "react";

const ordersColumns = [
  { field: "status", label: "Order Status", sortable: true },
  { field: "amount", label: "Order Amount", sortable: true },
  { field: "taxAmount", label: "Order Tax Amount", sortable: true },
  { field: "items", label: "Order Item Count", sortable: true },
  { field: "user", label: "Customer Name", sortable: false },
  { field: "restaurant", label: "Restaurant Name", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

interface OrdersListColumnsProps {
  handleSortByAndOrder: (field: string) => void;
}

const OrdersListColumns: React.FC<OrdersListColumnsProps> = ({
  handleSortByAndOrder,
}) => {
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
            {column.sortable ? <span className="text-lg">↕️</span> : null}
          </th>
        );
      })}
    </tr>
  );
};

export default OrdersListColumns;
