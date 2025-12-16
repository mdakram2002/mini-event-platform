import { createContext, useState, useContext, useCallback } from 'react';
import { eventService } from '../services/eventService.jsx';
import toast from 'react-hot-toast';

const EventContext = createContext();

export const useEvents = () => {
    const context = useContext(EventContext);
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

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await eventService.getAllEvents();
            setEvents(data);
        } catch (error) {
            toast.error('Failed to fetch events');
            console.error('Fetch events error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyEvents = useCallback(async () => {
        try {
            const data = await eventService.getMyEvents();
            setMyEvents(data);
        } catch (error) {
            toast.error('Failed to fetch your events');
            console.error('Fetch my events error:', error);
        }
    }, []);

    const fetchAttendingEvents = useCallback(async () => {
        try {
            const data = await eventService.getAttendingEvents();
            setAttendingEvents(data);
        } catch (error) {
            toast.error('Failed to fetch attending events');
            console.error('Fetch attending events error:', error);
        }
    }, []);

    const createEvent = async (eventData) => {
        try {
            const data = await eventService.createEvent(eventData);
            setEvents(prev => [data, ...prev]);
            setMyEvents(prev => [data, ...prev]);
            toast.success('Event created successfully!');
            return { success: true, data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create event';
            toast.error(message);
            return { success: false, message };
        }
    };

    const updateEvent = async (id, eventData) => {
        try {
            const data = await eventService.updateEvent(id, eventData);
            setEvents(prev => prev.map(event => event._id === id ? data : event));
            setMyEvents(prev => prev.map(event => event._id === id ? data : event));
            toast.success('Event updated successfully!');
            return { success: true, data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update event';
            toast.error(message);
            return { success: false, message };
        }
    };

    const deleteEvent = async (id) => {
        try {
            await eventService.deleteEvent(id);
            setEvents(prev => prev.filter(event => event._id !== id));
            setMyEvents(prev => prev.filter(event => event._id !== id));
            toast.success('Event deleted successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete event';
            toast.error(message);
            return { success: false, message };
        }
    };

    const value = {
        events,
        myEvents,
        attendingEvents,
        loading,
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