import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

const taxFeeColumns = [
  { field: "tax_name", label: "Name", sortable: true },
  { field: "tax_type", label: "Type", sortable: true },
  { field: "value", label: "Value", sortable: true },
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
      return sortOrder === "asc" ? (
        <ChevronUp className="h-[12px]" />
      ) : (
        <ChevronDown className="h-[12px]" />
      );
    }
    return (
      <>
        <ChevronUp className="h-[12px]" />
        <ChevronDown className="h-[12px] -mt-1" />
      </>
    );
  };
  return (
    <tr className="w-full">
      {taxFeeColumns.map((column) => {
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

export default TaxFeeColumnsListColumns;
