
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import TicketsPage from '../pages/Tickets/TicketsPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/auth/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
