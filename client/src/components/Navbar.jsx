import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/' },
        ...(isAuthenticated ? [{ name: 'My Events', path: '/my-events' }] : []),
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="container-responsive">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <FiCalendar className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-800">EventHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FiUser className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700 font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary px-6 py-2 rounded-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <FiX className="w-6 h-6 text-gray-600" />
                        ) : (
                            <FiMenu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center space-x-2 py-2">
                                        <FiUser className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700 font-medium">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 py-2"
                                    >
                                        <FiLogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary px-6 py-2 rounded-lg text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;