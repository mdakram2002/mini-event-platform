import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import EventForm from '../components/EventForm';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiUsers } from 'react-icons/fi';

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
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Events Attending',
            value: attendingEvents.length,
            icon: FiUsers,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
                    <p className="text-gray-600 mt-2">Manage your events and RSVPs</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary flex items-center space-x-2 px-6"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Create Event</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center space-x-4">
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Event Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <EventForm
                                onSubmit={handleCreateEvent}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'created'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Created Events
                    </button>
                    <button
                        onClick={() => setActiveTab('attending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'attending'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Attending Events
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
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events created yet</h3>
                            <p className="text-gray-600 mb-6">Create your first event and start inviting people!</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn-primary flex items-center space-x-2 mx-auto px-6"
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
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Not attending any events yet</h3>
                            <p className="text-gray-600 mb-6">Browse events and RSVP to join!</p>
                            <Link
                                to="/"
                                className="btn-primary inline-flex items-center space-x-2 px-6"
                            >
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