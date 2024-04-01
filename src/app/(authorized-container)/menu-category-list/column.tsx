import React from "react";

const menuCategoryColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "restaurant", label: "Restaurant", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

interface FoodItemListColumnsProps {
  handleSortByAndOrder: (field: string) => void;
}

const MenuCategoryListColumns: React.FC<FoodItemListColumnsProps> = ({
  handleSortByAndOrder,
}) => {
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
            {column.sortable ? <span className="text-lg">↕️</span> : null}
          </th>
        );
      })}
    </tr>
  );
};

export default MenuCategoryListColumns;
