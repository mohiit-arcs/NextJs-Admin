import React from "react";

interface PaginationProps {
  totalUsers: number | undefined;
  usersLimit: number;
  currentPage: number;
  entriesPerPageOptions: number[];
  handleEntriesPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

const Pagination = ({
  totalUsers,
  usersLimit,
  currentPage,
  entriesPerPageOptions,
  handleEntriesPerPageChange,
  goToPrevPage,
  goToNextPage,
}: PaginationProps) => {
  return (
    <>
      <p className="text-black text-xl m-2">Total Records: {totalUsers}</p>
      <div className="text-center">
        <label className="mr-2 text-gray-800">Entries per page: </label>
        <select
          value={usersLimit}
          onChange={handleEntriesPerPageChange}
          className="px-2 py-1 border mr-2 border-gray-300 rounded-md shadow-sm focus:outline-none text-black">
          {entriesPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ul className="inline-flex -space-x-px text-sm">
          <li
            onClick={goToPrevPage}
            className="flex cursor-pointer items-center justify-center px-3 py-2 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
            Previous
          </li>

          <li className="flex cursor-pointer items-center justify-center px-3 py-2 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            {currentPage}
          </li>

          <li
            onClick={goToNextPage}
            className="flex cursor-pointer items-center justify-center px-3 py-2 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
            Next
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;
