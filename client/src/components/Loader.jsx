const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-primary-600 dark:border-primary-400 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading events...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Please wait a moment</p>
            </div>
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse delay-200"></div>
            </div>
        </div>
    );
};

export default Loader;