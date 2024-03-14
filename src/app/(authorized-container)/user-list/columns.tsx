import React from "react";

const userColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "email", label: "Email", sortable: true },
  { field: "role", label: "Role", sortable: true },
  { field: "actions", label: "Actions", sortable: false },
];

interface UserColumnsProps {
  handleSortByAndOrder: (field: string) => void;
}

const UserColumns: React.FC<UserColumnsProps> = ({ handleSortByAndOrder }) => {
  return (
    <tr>
      {userColumns.map((column) => {
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

export default UserColumns;
