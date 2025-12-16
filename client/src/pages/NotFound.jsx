import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="mb-8">
                <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
                >
                    <FiHome className="w-5 h-5" />
                    <span>Go to Homepage</span>
                </Link>

                <Link
                    to="/"
                    className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3"
                >
                    <FiSearch className="w-5 h-5" />
                    <span>Browse Events</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;