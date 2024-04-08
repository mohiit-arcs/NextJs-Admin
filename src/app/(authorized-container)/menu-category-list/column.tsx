import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const menuCategoryColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "restaurant", label: "Restaurant", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

export interface FoodItemListColumnsProps {
  handleSortByAndOrder: (field: string) => void;
  sortBy: string;
  sortOrder: string;
}

const MenuCategoryListColumns: React.FC<FoodItemListColumnsProps> = ({
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
      {menuCategoryColumns.map((column) => {
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

export default MenuCategoryListColumns;
