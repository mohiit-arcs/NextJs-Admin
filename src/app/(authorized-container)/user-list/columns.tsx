import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const userColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "email", label: "Email", sortable: true },
  { field: "role", label: "Role", sortable: true },
  { field: "actions", label: "Actions", sortable: false },
];

export interface UserColumnsProps {
  handleSortByAndOrder: (field: string) => void;
  sortBy: string;
  sortOrder: string;
}

const UserColumns: React.FC<UserColumnsProps> = ({
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
      {userColumns.map((column) => {
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
              <span className=" text-sm">{getArrowIcon(column.field)}</span>
            ) : null}
            </div>
          </th>
        );
      })}
    </tr>
  );
};

export default UserColumns;
