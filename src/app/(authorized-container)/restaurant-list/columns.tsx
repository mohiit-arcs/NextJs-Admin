import React from "react";

const restaurantColumns = [
  { field: "name", label: "Name", sortable: true },
  { field: "email", label: "Email", sortable: true },
  { field: "phoneNumber", label: "Phone Number", sortable: true },
  { field: "street", label: "Street", sortable: true },
  { field: "city", label: "City", sortable: true },
  { field: "zipcode", label: "ZipCode", sortable: true },
  { field: "state", label: "State", sortable: true },
  { field: "country", label: "Country", sortable: true },
  { field: "image", label: "Image", sortable: false },
  { field: "actions", label: "Actions", sortable: false },
];

interface RestaurantColumnsProps {
  handleSortByAndOrder: (field: string) => void;
}

const RestaurantColumns: React.FC<RestaurantColumnsProps> = ({
  handleSortByAndOrder,
}) => {
  return (
    <tr>
      {restaurantColumns.map((column) => {
        return (
          <th
            onClick={() =>
              column.sortable && handleSortByAndOrder(column.field)
            }
            key={column.field}
            className="px-5 cursor-pointer  py-4 text-sm text-white font-bold">
            {column.label}{" "}
            {column.sortable ? <span className="text-lg">↕️</span> : null}
          </th>
        );
      })}
    </tr>
  );
};

export default RestaurantColumns;
