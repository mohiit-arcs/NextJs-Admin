import React from "react";

interface LimiPerPageProps {
  usersLimit: number;
  entriesPerPageOptions: number[];
  handleEntriesPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const LimiPerPage = ({
  usersLimit,
  entriesPerPageOptions,
  handleEntriesPerPageChange,
}: LimiPerPageProps) => {
  return (
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
  );
};

export default LimiPerPage;
