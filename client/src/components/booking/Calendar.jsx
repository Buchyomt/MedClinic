import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useBooking();
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  // Set default selected date if not set
  useEffect(() => {
    if (!selectedDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      setSelectedDate(defaultDate);
    }
  }, [selectedDate, setSelectedDate]);

  const handlePrevMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthLabel = currentViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Days calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const gridItems = [];

  // Empty slots before 1st of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    gridItems.push({ day: null });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    thisDate.setHours(0, 0, 0, 0);

    const isPast = thisDate < today;

    let isSelected = false;
    if (selectedDate) {
      const sel = new Date(selectedDate);
      isSelected = (
        sel.getFullYear() === year &&
        sel.getMonth() === month &&
        sel.getDate() === d
      );
    }

    gridItems.push({
      day: d,
      dateObj: thisDate,
      disabled: isPast,
      selected: isSelected
    });
  }

  const handleSelectDay = (item) => {
    if (!item.day || item.disabled) return;
    setSelectedDate(item.dateObj);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 px-2">
        <button 
          onClick={handlePrevMonth}
          className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-primary"
          title="Previous Month"
          aria-label="Previous Month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-[17px] font-bold text-gray-800">{monthLabel}</h2>

        <button 
          onClick={handleNextMonth}
          className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-primary"
          title="Next Month"
          aria-label="Next Month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-gray-400 tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-4">
        {gridItems.map((item, i) => (
          <div key={i} className="flex justify-center items-center h-10">
            {item.day && (
              <div 
                onClick={() => handleSelectDay(item)}
                className={`w-9 h-9 flex justify-center items-center rounded-full text-sm font-semibold cursor-pointer transition-all ${
                  item.selected
                    ? 'bg-primary text-white shadow-md font-bold scale-105' 
                    : item.disabled 
                      ? 'text-gray-300 line-through cursor-not-allowed decoration-gray-300 opacity-60' 
                      : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {item.day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

