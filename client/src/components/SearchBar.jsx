import React from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-primary" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-12 pr-4 py-3.5 border-0 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors"
        placeholder="Search for doctors, specializations..."
      />
    </div>
  )
}
