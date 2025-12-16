import api from './api';

export const eventService = {
    getAllEvents: async () => {
        const response = await api.get('/events');
        return response.data;
    },

    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (key === 'image' && eventData[key]) {
                formData.append('image', eventData[key]);
            } else {
                formData.append(key, eventData[key]);
            }
        });

        const response = await api.post('/events', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (key === 'image' && eventData[key]) {
                formData.append('image', eventData[key]);
            } else {
                formData.append(key, eventData[key]);
            }
        });

        const response = await api.put(`/events/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    getMyEvents: async () => {
        const response = await api.get('/events/my/events');
        return response.data;
    },

    getAttendingEvents: async () => {
        const response = await api.get('/events/my/attending');
        return response.data;
    },

    rsvpToEvent: async (eventId) => {
        const response = await api.post(`/rsvp/${eventId}`);
        return response.data;
    },

    cancelRSVP: async (eventId) => {
        const response = await api.delete(`/rsvp/${eventId}`);
        return response.data;
    },

    getRSVPStatus: async (eventId) => {
        const response = await api.get(`/rsvp/${eventId}/status`);
        return response.data;
    }
};