import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Confirm from './pages/Confirm';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorProfile from './pages/DoctorProfile';
import PharmacistProfile from './pages/PharmacistProfile';
import MedicalRecords from './pages/MedicalRecords';
import TelehealthRoom from './pages/TelehealthRoom';
import LiveQueue from './pages/LiveQueue';
import AppLayout from './components/layout/AppLayout';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FacilityProvider } from './context/FacilityContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FacilityProvider>
          <BookingProvider>
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/book" element={<Booking />} />
                  <Route path="/confirm" element={<Confirm />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/telehealth" element={<TelehealthRoom />} />
                  <Route path="/queue" element={<LiveQueue />} />
                  <Route path="/doctor/:id" element={<DoctorProfile />} />
                  <Route path="/pharmacist" element={<PharmacistProfile />} />
                  <Route path="/pharmacist/:id" element={<PharmacistProfile />} />
                  <Route path="/records" element={<MedicalRecords />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </BookingProvider>
        </FacilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
