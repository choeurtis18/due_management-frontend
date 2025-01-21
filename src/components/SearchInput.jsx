import React from "react";

const SearchInput = ({ searchQuery, onSearchChange, placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={onSearchChange}
      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  );
};

export default SearchInput;
