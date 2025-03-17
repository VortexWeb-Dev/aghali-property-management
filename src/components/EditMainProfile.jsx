import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Camera, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    instagram: '',
    facebook: '',
    telegram: '',
    whatsapp: '',
    profileVisibility: 'Open',
    profilePicture: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing data from localStorage
    const storedData = localStorage.getItem('profileData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleVisibilityChange = (visibility) => {
    setFormData(prevData => ({
      ...prevData,
      profileVisibility: visibility
    }));
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prevData => ({
          ...prevData,
          profilePicture: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    const currentData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const updatedData = { ...currentData, ...formData };
    localStorage.setItem('profileData', JSON.stringify(updatedData));
    
    // Redirect back to profile page
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/profile" className="mr-4">
              <ArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Picture Section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-100">
            <div className="relative">
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-100 shadow">
                  <span className="text-3xl font-semibold text-blue-600">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </span>
                </div>
              )}
              <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition">
                <Camera size={16} />
              </label>
              <input 
                type="file" 
                id="profile-picture" 
                accept="image/*" 
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">Upload a new profile picture</p>
          </div>

          {/* Profile Visibility */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4">Profile visibility</h3>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleVisibilityChange('Open')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.profileVisibility === 'Open' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Eye size={16} className="mr-2" />
                Open
              </button>
              <button
                type="button"
                onClick={() => handleVisibilityChange('Private')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.profileVisibility === 'Private' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <EyeOff size={16} className="mr-2" />
                Private
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a country</option>
                  <option value="United States">United States</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4">Social Media</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instagram username"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Facebook username"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telegram username"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="WhatsApp number"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex justify-end space-x-4">
            <Link 
              to="/profile" 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;