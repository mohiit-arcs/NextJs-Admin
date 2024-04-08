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
      {userColumns.map((column) => {
        return (
          <th
            onClick={() =>
              column.sortable && handleSortByAndOrder(column.field)
            }
            key={column.field}
            className="px-5 cursor-pointer py-4 text-sm text-white font-bold">
            {column.label}{" "}
            {column.sortable ? (
              <span className=" text-lg">{getArrowIcon(column.field)}</span>
            ) : null}
          </th>
        );
      })}
    </tr>
  );
};

export default UserColumns;
