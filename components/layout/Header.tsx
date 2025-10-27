
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Container from './Container';

const Header: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <Container>
                <div className="flex justify-between items-center py-4">
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        TicketApp
                    </Link>
                    <nav className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">Welcome, {user?.email}</span>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Dashboard</Link>
                                <Link to="/tickets" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Tickets</Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700">Login</Link>
                                <Link to="/auth/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Get Started</Link>
                            </>
                        )}
                    </nav>
                </div>
            </Container>
        </header>
    );
};

export default Header;
