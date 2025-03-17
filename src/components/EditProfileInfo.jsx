import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Star, Globe, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const EditInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    expertise: '',
    experience: '',
    languages: [],
    brn: ''
  });
  const [loading, setLoading] = useState(true);
  const [availableLanguages] = useState([
    'English', 'Spanish', 'Arabic', 'French', 'German', 'Chinese', 'Russian', 'Hindi', 'Portuguese', 'Japanese'
  ]);

  useEffect(() => {
    // Load existing data from localStorage
    const storedData = localStorage.getItem('profileData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Ensure languages is always an array
      if (typeof parsedData.languages === 'string') {
        parsedData.languages = parsedData.languages.split(',').map(lang => lang.trim());
      } else if (!Array.isArray(parsedData.languages)) {
        parsedData.languages = [];
      }
      setFormData({
        position: parsedData.position || '',
        expertise: parsedData.expertise || '',
        experience: parsedData.experience || '',
        languages: parsedData.languages || [],
        brn: parsedData.brn || ''
      });
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

  const handleLanguageToggle = (language) => {
    setFormData(prevData => {
      const updatedLanguages = [...prevData.languages];
      
      if (updatedLanguages.includes(language)) {
        return {
          ...prevData,
          languages: updatedLanguages.filter(lang => lang !== language)
        };
      } else {
        return {
          ...prevData,
          languages: [...updatedLanguages, language]
        };
      }
    });
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Information</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Professional Information */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <Briefcase size={20} className="text-blue-600 mr-3" />
              <h3 className="font-medium text-gray-800">Professional Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Real Estate Agent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Expertise</label>
                <select
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select expertise</option>
                  <option value="Residential Properties">Residential Properties</option>
                  <option value="Commercial Properties">Commercial Properties</option>
                  <option value="Luxury Properties">Luxury Properties</option>
                  <option value="Land Development">Land Development</option>
                  <option value="Property Management">Property Management</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Years of experience"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">BRN (Business Registration Number)</label>
                <input
                  type="text"
                  name="brn"
                  value={formData.brn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. BRN-12345"
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Globe size={20} className="text-blue-600 mr-3" />
              <h3 className="font-medium text-gray-800">Languages</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableLanguages.map(language => (
                <button
                  type="button"
                  key={language}
                  onClick={() => handleLanguageToggle(language)}
                  className={`px-4 py-3 rounded-lg border text-left flex items-center ${
                    formData.languages.includes(language)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-1">{language}</span>
                  {formData.languages.includes(language) && (
                    <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex justify-end space-x-4 border-t border-gray-100">
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

export default EditInfoPage;