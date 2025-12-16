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
    FiCheckCircle
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
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to events</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Event Header */}
                <div className="relative">
                    <img
                        src={event.image || '/default-event.jpg'}
                        alt={event.title}
                        className="w-full h-64 md:h-96 object-cover"
                    />
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
                                    className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    title="Edit Event"
                                >
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                    title="Delete Event"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Event Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                        {/* Left Column */}
                        <div className="lg:w-2/3 space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {event.title}
                                </h1>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <FiCalendar className="w-6 h-6 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium text-gray-900">
                                            {format(new Date(event.dateTime), 'EEEE, MMMM dd, yyyy • hh:mm a')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <FiMapPin className="w-6 h-6 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-gray-900">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <FiUsers className="w-6 h-6 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Capacity</p>
                                        <p className="font-medium text-gray-900">
                                            {event.attendees.length} / {event.capacity} attendees
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer */}
                            <div className="border-t border-gray-200 pt-6">
                                <p className="text-sm text-gray-500 mb-2">Organized by</p>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-primary-600 font-bold text-lg">
                                            {event.organizer.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{event.organizer.name}</p>
                                        <p className="text-gray-600">{event.organizer.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - RSVP Section */}
                        <div className="lg:w-1/3">
                            <div className="card sticky top-6">
                                <div className="space-y-6">
                                    {/* Attendees Count */}
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary-600 mb-2">
                                            {event.attendees.length}
                                        </div>
                                        <p className="text-gray-600">people are attending</p>
                                    </div>

                                    {/* RSVP Button */}
                                    {isAuthenticated && (
                                        <button
                                            onClick={handleRSVP}
                                            disabled={rsvpLoading || !canRSVP}
                                            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${rsvpStatus.isRSVPed
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : canRSVP
                                                        ? 'btn-primary'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {rsvpLoading ? (
                                                'Processing...'
                                            ) : rsvpStatus.isRSVPed ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <FiCheckCircle className="w-5 h-5" />
                                                    <span>Going</span>
                                                </div>
                                            ) : isOrganizer ? (
                                                'Your Event'
                                            ) : isEventFull ? (
                                                'Event Full'
                                            ) : (
                                                'RSVP Now'
                                            )}
                                        </button>
                                    )}

                                    {/* Login Prompt */}
                                    {!isAuthenticated && (
                                        <div className="text-center space-y-4">
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="btn-primary w-full py-3"
                                            >
                                                Login to RSVP
                                            </button>
                                            <p className="text-sm text-gray-600">
                                                Sign in to join this event
                                            </p>
                                        </div>
                                    )}

                                    {/* Capacity Info */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Capacity</span>
                                            <span className="font-medium">
                                                {event.attendees.length} / {event.capacity}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${(event.attendees.length / event.capacity) * 100}%`
                                                }}
                                            ></div>
                                        </div>
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