import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

const taxFeeColumns = [
  { field: "tax_name", label: "Name", sortable: true },
  { field: "tax_type", label: "Type", sortable: true },
  { field: "value", label: "Value", sortable: true },
  { field: "restaurant", label: "Restaurant", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

export interface FoodItemListColumnsProps {
  sortBy: string;
  sortOrder: string;
  handleSortByAndOrder: (field: string) => void;
}

const TaxFeeColumnsListColumns: React.FC<FoodItemListColumnsProps> = ({
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
      {taxFeeColumns.map((column) => {
        return (
          <th
            onClick={() =>
              column.sortable && handleSortByAndOrder(column.field)
            }
            key={column.field}
            className="py-4 w-[24%] px-3  cursor-pointer text-sm text-white font-bold">
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

export default TaxFeeColumnsListColumns;
