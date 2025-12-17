import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

const EventCard = ({ event }) => {
    const attendeesCount = event.attendees?.length || 0;
    const isFull = attendeesCount >= event.capacity;

    return (
        <div className="card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:hover:shadow-primary-900/20">
            <div className="flex flex-col h-full">
                {/* Event Image */}
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <img
                        src={event.image || '/default-event.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {isFull && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold dark:bg-red-500">
                            Full
                        </div>
                    )}
                    {!isFull && attendeesCount > 0 && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold dark:bg-green-500">
                            {attendeesCount} Going
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                    </p>

                    {/* Event Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiCalendar className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                            <span>{format(new Date(event.dateTime), 'MMM dd, yyyy • hh:mm a')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiMapPin className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiUsers className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                            <span>{attendeesCount} / {event.capacity} attendees</span>
                        </div>
                    </div>
                </div>

                {/* Organizer and Action */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Organized by</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                {event.organizer?.name || 'Unknown'}
                            </p>
                        </div>
                        <Link
                            to={`/event/${event._id}`}
                            className="btn-primary px-6 py-2 hover:shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-primary-400/20"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;