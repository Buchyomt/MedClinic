import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <Link to="/" className="text-primary p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
        <ChevronLeft size={24} strokeWidth={2.5} />
      </Link>
      <h1 className="text-xl font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">
        Select a Time
      </h1>
      <div className="w-8"></div> {/* Spacer to keep title centered */}
    </div>
  )
}
