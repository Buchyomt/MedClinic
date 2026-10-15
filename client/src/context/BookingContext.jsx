import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState('in_person'); // 'in_person' | 'telehealth'
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });

  const value = {
    selectedDoctor,
    setSelectedDoctor,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    consultationType,
    setConsultationType,
    patientDetails,
    setPatientDetails
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
