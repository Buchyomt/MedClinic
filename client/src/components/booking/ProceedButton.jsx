import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProceedButton() {
  const navigate = useNavigate();
  // Validation could go here using useBooking()

  const handleProceed = () => {
    // We could add validation here, but we set defaults in the components
    navigate('/confirm');
  };

  return (
    <button 
      onClick={handleProceed}
      className="block w-full bg-primary text-white text-center font-bold py-4 rounded-2xl shadow-[0_4px_14px_rgba(29,78,216,0.3)] hover:bg-primary-dark transition-colors"
    >
      Proceed to Details
    </button>
  )
}
