const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
        </div>
    );
};

export default Loader;