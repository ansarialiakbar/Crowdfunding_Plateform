import { useState } from "react";

const SearchBar = ({ searchQuery, setSearchQuery, searchCategory, setSearchCategory, onSearch }) => {
  
  // ✅ Trigger search when "Enter" key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      console.warn("⚠️ Empty search query, skipping search.");
      return;
    }
    console.log(`📢 Searching for ${searchCategory}: "${searchQuery}"`);
    onSearch(searchQuery, searchCategory);
  };

  return (
    <div className="flex space-x-2 mb-4">
      {/* ✅ Dropdown to select search category */}
      <select
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
        className="border px-2 py-2 rounded"
      >
        <option value="campaigns">Campaigns</option>
        <option value="users">Users</option>
        <option value="donations">Donations</option>
      </select>

      {/* ✅ Input field for search query */}
      <input
        type="text"
        placeholder={`Search ${searchCategory}...`}
        className="border p-2 w-full rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} // ✅ Support for pressing "Enter"
      />

      {/* ✅ Search button */}
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
