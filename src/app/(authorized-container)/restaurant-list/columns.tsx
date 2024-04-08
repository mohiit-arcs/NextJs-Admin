import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

const restaurantColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "email", label: "Email", sortable: true },
  { field: "phoneNumber", label: "Phone No.", sortable: true },
  { field: "street", label: "Street", sortable: true },
  { field: "city", label: "City", sortable: true },
  { field: "zipcode", label: "ZipCode", sortable: true },
  { field: "state", label: "State", sortable: true },
  { field: "country", label: "Country", sortable: true },
  { field: "actions", label: "Actions", sortable: false },
];

export interface RestaurantColumnsProps {
  handleSortByAndOrder: (field: string) => void;
  sortBy: string;
  sortOrder: string;
}

const RestaurantColumns: React.FC<RestaurantColumnsProps> = ({
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
    <tr className="w-full">
      {restaurantColumns.map((column) => {
        return (
          <th
            onClick={() =>
              column.sortable && handleSortByAndOrder(column.field)
            }
            key={column.field}
            className="py-4 w-[10%] px-3  cursor-pointer text-sm text-white font-bold">
            {column.label}{" "}
            {column.sortable ? (
              <span className="text-sm">{getArrowIcon(column.field)}</span>
            ) : null}
          </th>
        );
      })}
    </tr>
  );
};

export default RestaurantColumns;
