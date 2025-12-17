import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { eventService } from "../services/eventService";
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import {
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiEdit2,
    FiTrash2,
    FiArrowLeft,
    FiCheckCircle,
    FiMail,
    FiUser,
    FiClock
} from 'react-icons/fi';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { deleteEvent } = useEvents();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpStatus, setRsvpStatus] = useState({ isRSVPed: false });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        if (isAuthenticated) {
            fetchRSVPStatus();
        }
    }, [id, isAuthenticated]);

    const fetchEventDetails = async () => {
        try {
            const data = await eventService.getEventById(id);
            setEvent(data);
        } catch (error) {
            toast.error('Failed to fetch event details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const fetchRSVPStatus = async () => {
        try {
            const data = await eventService.getRSVPStatus(id);
            setRsvpStatus(data);
        } catch (error) {
            console.error('Failed to fetch RSVP status:', error);
        }
    };

    const handleRSVP = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to RSVP');
            navigate('/login');
            return;
        }

        setRsvpLoading(true);
        try {
            if (rsvpStatus.isRSVPed) {
                await eventService.cancelRSVP(id);
                setRsvpStatus({ isRSVPed: false });
                setEvent(prev => ({
                    ...prev,
                    attendees: prev.attendees.filter(attendee => attendee._id !== user._id)
                }));
                toast.success('RSVP cancelled successfully');
            } else {
                await eventService.rsvpToEvent(id);
                setRsvpStatus({ isRSVPed: true });
                setEvent(prev => ({
                    ...prev,
                    attendees: [...prev.attendees, user]
                }));
                toast.success('Successfully RSVP\'d to event!');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'RSVP action failed';
            toast.error(message);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteEvent(id);
        if (result.success) {
            toast.success('Event deleted successfully');
            navigate('/');
        }
        setIsDeleting(false);
    };

    if (loading) return <Loader />;
    if (!event) return null;

    const isOrganizer = user && event.organizer._id === user._id;
    const isEventFull = event.attendees.length >= event.capacity;
    const canRSVP = !isOrganizer && !isEventFull;

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to events</span>
            </button>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Event Header */}
                <div className="relative">
                    <img
                        src={event.image || '/default-event.jpg'}
                        alt={event.title}
                        className="w-full h-64 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {isEventFull && (
                            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                Event Full
                            </span>
                        )}
                        {isOrganizer && (
                            <>
                                <button
                                    onClick={() => navigate(`/event/${id}/edit`)}
                                    className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
                                    title="Edit Event"
                                >
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-white/90 dark:bg-gray-800/90 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                                    title="Delete Event"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                            {event.title}
                        </h1>
                    </div>
                </div>

                {/* Event Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-8 lg:space-y-0 lg:space-x-8">
                        {/* Left Column */}
                        <div className="lg:w-2/3 space-y-8">
                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About this event</h2>
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Event Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                            <FiCalendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {format(new Date(event.dateTime), 'EEEE, MMMM dd, yyyy')}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {format(new Date(event.dateTime), 'hh:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                            <FiMapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{event.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                            <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Capacity</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {event.attendees.length} / {event.capacity} attendees
                                            </p>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${Math.min((event.attendees.length / event.capacity) * 100, 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                            <FiClock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {event.duration || '3 hours'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer */}
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Organized by</h2>
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xl">
                                            {event.organizer.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{event.organizer.name}</p>
                                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mt-1">
                                            <FiMail className="w-4 h-4" />
                                            <span>{event.organizer.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - RSVP Section */}
                        <div className="lg:w-1/3">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                                <div className="space-y-6">
                                    {/* Attendees Count */}
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                            {event.attendees.length}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">people are attending</p>
                                        {event.attendees.length > 0 && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                Join them at this exciting event!
                                            </p>
                                        )}
                                    </div>

                                    {/* RSVP Button */}
                                    <div>
                                        {isAuthenticated ? (
                                            <button
                                                onClick={handleRSVP}
                                                disabled={rsvpLoading || !canRSVP}
                                                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${rsvpStatus.isRSVPed
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                                                        : canRSVP
                                                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-800 dark:hover:to-primary-900 text-white shadow-lg transform hover:-translate-y-1'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                    } ${canRSVP ? 'hover:shadow-xl' : ''}`}
                                            >
                                                {rsvpLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : rsvpStatus.isRSVPed ? (
                                                    <>
                                                        <FiCheckCircle className="w-6 h-6" />
                                                        <span>You're Going</span>
                                                    </>
                                                ) : isOrganizer ? (
                                                    'Your Event'
                                                ) : isEventFull ? (
                                                    'Event Full'
                                                ) : (
                                                    'RSVP Now'
                                                )}
                                            </button>
                                        ) : (
                                            <div className="text-center space-y-4">
                                                <button
                                                    onClick={() => navigate('/login')}
                                                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-700 dark:to-primary-800 dark:hover:from-primary-800 dark:hover:to-primary-900 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center space-x-2"
                                                >
                                                    <FiUser className="w-5 h-5" />
                                                    <span>Sign in to RSVP</span>
                                                </button>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Sign in to join this event and connect with attendees
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Event Status Info */}
                                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {event.attendees.length} / {event.capacity}
                                            </span>
                                        </div>

                                        {isEventFull && (
                                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                <p className="text-sm text-red-700 dark:text-red-400 text-center">
                                                    his event has reached maximum capacity
                                                </p>
                                            </div>
                                        )}

                                        {!isEventFull && event.attendees.length >= event.capacity * 0.8 && (
                                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                <p className="text-sm text-yellow-700 dark:text-yellow-400 text-center">
                                                    Almost full! Limited spots remaining
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;