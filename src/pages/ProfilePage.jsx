import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, MapPin, Instagram, Facebook, 
  Share2, LogOut, QrCode, MessageSquare, Send, Edit,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if data exists in localStorage
    const storedData = localStorage.getItem('profileData');
    
    if (storedData) {
      setProfileData(JSON.parse(storedData));
      setLoading(false);
    } else {
      // Initialize with mock data if not available
      const mockData = {
        firstName: 'Alice',
        lastName: 'Johnson',
        phone: '+11234567890',
        email: 'alice.johnson@example.com',
        country: 'United States',
        instagram: 'alice_insta',
        facebook: 'alice.fb',
        telegram: 'alice_telegram',
        whatsapp: '+11234567890',
        profileVisibility: 'Open',
        userId: 'user-user-173407226312',
        userCode: 'x462971567294141001',
        position: 'Real Estate Agent',
        expertise: 'Residential Properties',
        experience: 5,
        languages: ['English', 'Spanish'],
        brn: 'BRN-12345',
        profilePicture: null
      };
      
      localStorage.setItem('profileData', JSON.stringify(mockData));
      setProfileData(mockData);
      setLoading(false);
    }
  }, []);

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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <Link to="/profile/edit-profile" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Edit size={18} className="mr-2" />
              Edit profile
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile Picture & QR */}
              <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                <div className="relative">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-100 shadow">
                      <span className="text-3xl font-semibold text-blue-600">
                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                  <QrCode size={100} />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {profileData.userId}
                </div>
                <div className="text-xs text-gray-500">
                  {profileData.userCode}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-blue-600 font-medium">{profileData.position}</p>
                    
                  </div>
                  <div className="flex mt-4 md:mt-0">
                    <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg mr-2 hover:bg-blue-100 transition flex items-center">
                      <Share2 size={16} className="mr-1" />
                      Share
                    </button>
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center">
                      <LogOut size={16} className="mr-1" />
                      Log Out
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-700">{profileData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-gray-700">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Country</p>
                      <p className="text-gray-700">{profileData.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Visibility
                      </p>
                      <p className="text-gray-700">{profileData.profileVisibility}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Instagram size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Instagram</p>
                      <p className="text-gray-700">{profileData.instagram}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Facebook size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Facebook</p>
                      <p className="text-gray-700">{profileData.facebook}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Send size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Telegram</p>
                      <p className="text-gray-700">{profileData.telegram}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={16} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-gray-700">{profileData.whatsapp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Information</h3>
            <Link to="/profile/edit-info" className="text-blue-600 hover:text-blue-700 transition flex items-center">
              <Edit size={16} className="mr-1" />
              Edit Info
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Position</span>
                <span className="font-medium text-gray-800">{profileData.position}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Expertise</span>
                <span className="font-medium text-gray-800">{profileData.expertise}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-gray-800">{profileData.experience} years</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Languages</span>
                <span className="font-medium text-gray-800">{profileData.languages.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">BRN</span>
                <span className="font-medium text-gray-800">{profileData.brn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;