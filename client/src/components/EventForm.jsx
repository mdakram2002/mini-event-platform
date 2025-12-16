import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const EventForm = ({ initialData = {}, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        dateTime: initialData.dateTime ?
            new Date(initialData.dateTime).toISOString().slice(0, 16) :
            '',
        location: initialData.location || '',
        capacity: initialData.capacity || 10,
        image: null
    });

    const [preview, setPreview] = useState(initialData.image || '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter event title"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field min-h-[120px]"
                    placeholder="Describe your event..."
                    required
                />
            </div>

            {/* Date & Time */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time *
                </label>
                <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter event location"
                    required
                />
            </div>

            {/* Capacity */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                </label>
                <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="input-field"
                    min="1"
                    required
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                </label>
                <div className="space-y-4">
                    {preview && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors duration-200">
                        <div className="flex flex-col items-center">
                            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-primary-600">Upload a file</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 5MB
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-lg font-semibold"
                >
                    {loading ? 'Processing...' : (initialData.title ? 'Update Event' : 'Create Event')}
                </button>
            </div>
        </form>
    );
};

export default EventForm;