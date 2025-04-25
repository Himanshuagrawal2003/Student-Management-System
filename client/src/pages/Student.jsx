import React, { useState } from 'react';
import Table from '../components/Table';
import AddButton from '../components/AddButton';
import SearchIcon from '@mui/icons-material/Search';

export default function Student() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <AddButton ModelName="Student" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-6 bg-gray-100 rounded-md px-4 py-2 w-full max-w-md">
        <SearchIcon className="text-gray-600 mr-2" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none w-full"
        />
      </div>

      {/* Table Section */}
      <Table modelName="Student" searchQuery={searchTerm} />
    </div>
  );
}
