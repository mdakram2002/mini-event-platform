import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { eventService } from '../services/eventService.jsx';
import toast from 'react-hot-toast';

const EventContext = createContext();

export const useEvents = () => {
    const context = useContext(EventContext);
    console.log('useEvents hook - context:', context);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to extract events from different response structures
    const extractEventsData = (response) => {
        console.log('Extracting data from response:', response);

        // Case 1: Direct array
        if (Array.isArray(response)) {
            console.log('Direct array response');
            return response;
        }

        // Case 2: Axios response with data property
        if (response && response.data && Array.isArray(response.data)) {
            console.log('Axios response with data property');
            return response.data;
        }

        // Case 3: Custom API wrapper {success: true, data: [...]}
        if (response && response.success && Array.isArray(response.data)) {
            console.log('Custom API wrapper response');
            return response.data;
        }

        // Case 4: Alternative wrapper {events: [...]}
        if (response && response.events && Array.isArray(response.events)) {
            console.log('Alternative wrapper with events property');
            return response.events;
        }

        // Case 5: Single event object (for create/update operations)
        if (response && response._id) {
            console.log('Single event object');
            return response;
        }

        console.log('Unknown response format:', response);
        return [];
    };

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching events from service...');
            const response = await eventService.getAllEvents();
            console.log('Service response:', response);

            const eventsData = extractEventsData(response);
            console.log('Extracted events data:', eventsData);
            console.log('Data length:', eventsData?.length || 0);

            if (eventsData && Array.isArray(eventsData)) {
                setEvents(eventsData);
                console.log('Events state updated with', eventsData.length, 'events');
            } else {
                console.error('Invalid events data format, setting empty array');
                setEvents([]);
            }

        } catch (error) {
            console.error('Fetch events error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            toast.error('Failed to fetch events');
            setError(error.message);
            setEvents([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyEvents = useCallback(async () => {
        try {
            setError(null);
            console.log('Fetching my events...');
            const response = await eventService.getMyEvents();
            console.log('My events response:', response);

            const eventsData = extractEventsData(response);

            if (eventsData && Array.isArray(eventsData)) {
                setMyEvents(eventsData);
                console.log('MyEvents updated with', eventsData.length, 'events');
            } else {
                console.error('Invalid my events data');
                setMyEvents([]);
            }
        } catch (error) {
            console.error('Fetch my events error:', error);
            toast.error('Failed to fetch your events');
            setError(error.message);
            setMyEvents([]);
        }
    }, []);

    const fetchAttendingEvents = useCallback(async () => {
        try {
            setError(null);
            console.log('Fetching attending events...');
            const response = await eventService.getAttendingEvents();
            console.log('Attending events response:', response);

            const eventsData = extractEventsData(response);

            if (eventsData && Array.isArray(eventsData)) {
                setAttendingEvents(eventsData);
                console.log('AttendingEvents updated with', eventsData.length, 'events');
            } else {
                console.error('Invalid attending events data');
                setAttendingEvents([]);
            }
        } catch (error) {
            console.error('Fetch attending events error:', error);
            toast.error('Failed to fetch attending events');
            setError(error.message);
            setAttendingEvents([]);
        }
    }, []);

    const createEvent = async (eventData) => {
        try {
            setError(null);
            console.log('Creating event with data:', eventData);
            const response = await eventService.createEvent(eventData);
            console.log('Create event response:', response);

            const newEvent = extractEventsData(response);

            if (newEvent && newEvent._id) {
                setEvents(prev => [newEvent, ...prev]);
                setMyEvents(prev => [newEvent, ...prev]);
                toast.success('Event created successfully!');
                console.log('Event created successfully:', newEvent._id);
                return { success: true, data: newEvent };
            } else {
                throw new Error('Invalid response from create event API');
            }
        } catch (error) {
            console.error('Create event error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to create event';
            toast.error(message);
            setError(message);
            return { success: false, message };
        }
    };

    const updateEvent = async (id, eventData) => {
        try {
            setError(null);
            console.log('Updating event', id, 'with data:', eventData);
            const response = await eventService.updateEvent(id, eventData);
            console.log('Update event response:', response);

            const updatedEvent = extractEventsData(response);

            if (updatedEvent && updatedEvent._id) {
                setEvents(prev => prev.map(event => event._id === id ? updatedEvent : event));
                setMyEvents(prev => prev.map(event => event._id === id ? updatedEvent : event));
                toast.success('Event updated successfully!');
                console.log('Event updated successfully:', id);
                return { success: true, data: updatedEvent };
            } else {
                throw new Error('Invalid response from update event API');
            }
        } catch (error) {
            console.error('Update event error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to update event';
            toast.error(message);
            setError(message);
            return { success: false, message };
        }
    };

    const deleteEvent = async (id) => {
        try {
            setError(null);
            console.log('Deleting event:', id);
            await eventService.deleteEvent(id);

            setEvents(prev => prev.filter(event => event._id !== id));
            setMyEvents(prev => prev.filter(event => event._id !== id));
            setAttendingEvents(prev => prev.filter(event => event._id !== id));

            toast.success('Event deleted successfully!');
            console.log('Event deleted successfully:', id);
            return { success: true };
        } catch (error) {
            console.error('Delete event error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to delete event';
            toast.error(message);
            setError(message);
            return { success: false, message };
        }
    };

    // Debug effect to log state changes
    useEffect(() => {
        console.log('Events state changed:', {
            eventsCount: events.length,
            myEventsCount: myEvents.length,
            attendingEventsCount: attendingEvents.length,
            loading,
            error
        });
    }, [events, myEvents, attendingEvents, loading, error]);

    const value = {
        events,
        myEvents,
        attendingEvents,
        loading,
        error,
        fetchEvents,
        fetchMyEvents,
        fetchAttendingEvents,
        createEvent,
        updateEvent,
        deleteEvent
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};