import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Dashboard = () => {
    const { events, loading, fetchEvents } = useEvents();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm, events]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
                    <p className="text-gray-600 mt-2">Discover and join exciting events around you</p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10 w-full sm:w-64"
                        />
                    </div>

                    {/* Filter Button (Optional) */}
                    <button className="flex items-center justify-center space-x-2 btn-secondary px-4">
                        <FiFilter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <Loader />
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try a different search term' : 'No events are scheduled yet'}
                    </p>
                </div>
            )}

            {/* Stats */}
            {!loading && filteredEvents.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-600 text-center">
                        Showing <span className="font-semibold text-primary-600">{filteredEvents.length}</span> of{' '}
                        <span className="font-semibold text-primary-600">{events.length}</span> events
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;