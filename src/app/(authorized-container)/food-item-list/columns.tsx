import React from "react";

const foodItemsColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "restaurants", label: "Restaurants", sortable: true },
  { field: "categories", label: "Categories", sortable: true },
  { field: "actions", label: "Actions", sortable: false },
];

interface FoodItemListColumnsProps {
  handleSortByAndOrder: (field: string) => void;
}

const FoodItemListColumns: React.FC<FoodItemListColumnsProps> = ({
  handleSortByAndOrder,
}) => {
  return (
    <tr>
      {foodItemsColumns.map((column) => {
        return (
          <th
            key={column.field}
            className="px-5 py-4 text-sm text-white font-bold">
            {column.label}{" "}
            {column.sortable ? (
              <span
                onClick={() => handleSortByAndOrder(column.field)}
                className="cursor-pointer text-lg">
                ↕️
              </span>
            ) : null}
          </th>
        );
      })}
    </tr>
  );
};

export default FoodItemListColumns;
