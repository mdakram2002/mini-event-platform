import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import EventForm from '../components/EventForm';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiUsers, FiX, FiSearch } from 'react-icons/fi';

const MyEvents = () => {
    const { myEvents, attendingEvents, fetchMyEvents, fetchAttendingEvents, createEvent } = useEvents();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('created');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyEvents();
        fetchAttendingEvents();
    }, [fetchMyEvents, fetchAttendingEvents]);

    const handleCreateEvent = async (eventData) => {
        setLoading(true);
        const result = await createEvent(eventData);
        setLoading(false);

        if (result.success) {
            setShowCreateForm(false);
            toast.success('Event created successfully!');
        }
    };

    const stats = [
        {
            label: 'Events Created',
            value: myEvents.length,
            icon: FiCalendar,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            iconBg: 'bg-blue-500/10 dark:bg-blue-500/20'
        },
        {
            label: 'Events Attending',
            value: attendingEvents.length,
            icon: FiUsers,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            iconBg: 'bg-green-500/10 dark:bg-green-500/20'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Events</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your events and RSVPs</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-800 dark:hover:to-primary-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center justify-center gap-2"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Create Event</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-full`}>
                                    <Icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Event Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Event</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Fill in the details below to create your event</p>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <FiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6">
                            <EventForm
                                onSubmit={handleCreateEvent}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'created'
                                ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        Created Events ({myEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('attending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'attending'
                                ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        Attending Events ({attendingEvents.length})
                    </button>
                </nav>
            </div>

            {/* Events List */}
            <div>
                {activeTab === 'created' ? (
                    myEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="text-gray-400 dark:text-gray-600 mb-6">
                                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No events created yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your first event and start inviting people to join exciting gatherings!</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-800 dark:hover:to-primary-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center justify-center gap-2 mx-auto"
                            >
                                <FiPlus className="w-5 h-5" />
                                <span>Create Your First Event</span>
                            </button>
                        </div>
                    )
                ) : (
                    attendingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {attendingEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="text-gray-400 dark:text-gray-600 mb-6">
                                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Not attending any events yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Browse upcoming events and RSVP to join interesting gatherings in your area!</p>
                            <Link
                                to="/"
                                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-800 dark:hover:to-primary-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 inline-flex items-center justify-center gap-2"
                            >
                                <FiSearch className="w-5 h-5" />
                                <span>Browse Events</span>
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MyEvents;