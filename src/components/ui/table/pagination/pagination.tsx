import React from "react";

interface PaginationProps {
  totalUsers: number | undefined;
  currentPage: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

const Pagination = ({
  totalUsers,
  currentPage,
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
            Previous
          </li>

          <li
            className="flex cursor-pointer items-center justify-center px-4 py-2
          leading-tight text-[#BDBDBD] 
           hover:text-gray-700">
            {currentPage}
          </li>

          <li
            onClick={goToNextPage}
            className="flex cursor-pointer items-center justify-center leading-tight px-2 py-2
             text-[#BDBDBD]
              hover:text-gray-700">
            Next
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;
