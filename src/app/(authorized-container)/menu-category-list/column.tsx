import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const menuCategoryColumns = [
  { field: "name", label: "Name", sortable: true },
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
    <tr className="w-full">
      {menuCategoryColumns.map((column) => {
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
              <span className="text-lg">{getArrowIcon(column.field)}</span>
            ) : null}
            </div>
          </th>
        );
      })}
    </tr>
  );
};

export default MenuCategoryListColumns;
