import { ChevronsLeft, ChevronsRight } from "lucide-react";
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
    <div className="flex items-center justify-between px-6">

      <p className="text-black text-sm m-0">Total Records: {totalUsers}</p>

        <ul className="inline-flex -space-x-px text-sm">
          <li
            onClick={goToPrevPage}
            className="flex cursor-pointer items-center justify-center px-2 py-2 
            leading-tight text-[#BDBDBD]  
               hover:text-gray-700">
            {/* <ChevronsLeft/> */}
            Previous
          </li>

          <li className="flex cursor-pointer items-center justify-center px-4 py-2
          leading-tight text-[#BDBDBD] 
           hover:text-gray-700">
            {currentPage}
          </li>

          <li
            onClick={goToNextPage}
            className="flex cursor-pointer items-center justify-center leading-tight px-2 py-2
             text-[#BDBDBD]
              hover:text-gray-700">
            {/* <ChevronsRight/> */}
            Next
          </li>
        </ul>

        <div>
          <label className="mr-2 text-sm text-gray-800">Entries per page: </label>
          <select
            value={usersLimit}
            onChange={handleEntriesPerPageChange}
            className="text-sm py-1 border mr-2 border-gray-300 rounded-md shadow-sm focus:outline-none text-black">
            {entriesPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

      </div>
    </>

  );
};

export default Pagination;
