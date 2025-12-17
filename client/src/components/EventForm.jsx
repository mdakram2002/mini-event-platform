import { useState } from 'react';
import { FiUpload, FiImage } from 'react-icons/fi';

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Image
                </label>
                <div className="space-y-4">
                    {preview ? (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview('');
                                    setFormData(prev => ({ ...prev, image: null }));
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-primary-600 dark:text-primary-400">Upload a file</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-lg font-semibold hover:shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-primary-400/20 transition-all duration-300"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        initialData.title ? 'Update Event' : 'Create Event'
                    )}
                </button>
            </div>
        </form>
    );
};

export default EventForm;