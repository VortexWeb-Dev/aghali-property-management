import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Home, Bed, Bath, LandPlot, DollarSign, Car, Wind, ShieldCheck, CircleDot, Image as ImageIcon, FileText, Building, Flag, Download, Edit, Delete }from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import EditProperty from './../modals/EditProperty'

const PropertyDetails = ({id}) => {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);


  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`https://vortexwebpropertymanagement.com/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Placeholder images if no photos available
  const placeholderImages = [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ];

  const images = property?.photos?.length > 0 ? property.photos : placeholderImages;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  const onUpdatePropertyData = async (updatedPropertyData) => {
    try {
      // Make a PATCH request to the backend to update the PropertyData
      const response = await axios.patch(
        `https://vortexwebpropertymanagement.com/api/properties/${updatedPropertyData.id}`,
        updatedPropertyData
      );

      if (response.status === 200) {
        console.log("PropertyData updated successfully:", response.data);

        setProperty({
          ...property,
          ...updatedPropertyData, // Update the property data with new values
        });

        window.alert("PropertyData updated successfully!");
      }
    } catch (error) {
      console.error("Error updating PropertyData:", error);
      window.alert("Failed to update PropertyData. Please try again.");
    }
  };

  const renderFeatureAmenities = (title, items, color) => (
    items && items.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className="flex items-center">
              <CircleDot className={`w-4 h-4 ${color} mr-2`} />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}

        <div className='flex gap-[70%]'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
          >
          <div className='flex gap-96'>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to properties</span>
          </button>
            </div>
        </motion.div>

        <div className='flex gap-8'> 
          {/* <button
          className="flex items-center text-green-600 hover:text-gray-900 transition-colors duration-200"
          >
          <Edit className="w-8 h-8 m-3"/>
            Edit
          </button> */}
          <EditProperty
            onUpdateProperty={onUpdatePropertyData}
            existingProperty={property}
          />
          <button
          className="flex items-center text-red-600 hover:text-gray-900 transition-colors duration-200"
          >
          <Delete className="w-8 h-8 m-3" />
            Delete
          </button>
            </div>
            </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Core Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
              <div className="relative aspect-w-16 aspect-h-9 h-72">
                {images.length > 0 ? (
                  <img 
                    src={images[activeImage]} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail navigation */}
              {images.length > 1 && (
                <div className="flex p-4 gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        activeImage === index ? 'border-green-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Property core info card */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm mb-6"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{property.name}</h1>
              
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.address}, {property.city}, {property.stateOrRegion} {property.zip}, {property.country}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium text-gray-700">{property.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-medium text-gray-700">{property.buildYear || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center mb-1">
                    <Bed className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Beds</span>
                  </div>
                  <p className="font-semibold text-gray-700">{property.beds || 0}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center mb-1">
                    <Bath className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Baths</span>
                  </div>
                  <p className="font-semibold text-gray-700">{property.baths || 0}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center mb-1">
                    <LandPlot className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Size</span>
                  </div>
                  <p className="font-semibold text-gray-700">{property.size || 0} sqft</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center mb-1">
                    <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Rent</span>
                  </div>
                  <p className="font-semibold text-gray-700">{property.marketRent?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <span>Contact Property Manager</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Attachments card if any */}
            {property.attachments && property.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  Documents
                </h2>
                
                <div className="space-y-3">
                  {property.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700">{attachment.match(/[^/]+$/) || `Document ${index + 1}`}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Download className="w-5 h-5" onClick={()=> {window.location.href = attachment}}/>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Financial Details */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                Financial Details
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Market Rent</p>
                  <p className="font-semibold text-gray-800 text-lg">{property.marketRent?.toLocaleString() || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                  <p className="font-semibold text-gray-800 text-lg">{property.deposit?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Property Specifications */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-gray-500" />
                Property Specifications
              </h2>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-start">
                  <Car className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Parking</p>
                    <p className="font-medium text-gray-700">{property.parking || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Wind className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Air Conditioning</p>
                    <p className="font-medium text-gray-700">{property.ac || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ShieldCheck className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Laundry</p>
                    <p className="font-medium text-gray-700">{property.laundry || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Flag className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium text-gray-700">{property.country || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Features & Amenities */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              
              {(property.feature?.length || property.amenities?.length) ? (
  <div className="space-y-4">
    {renderFeatureAmenities("Features", property.feature, "text-green-500")}
    {renderFeatureAmenities("Amenities", property.amenities, "text-blue-500")}
  </div>
) : (
  <p className="text-gray-500">No features or amenities listed</p>
)}

            </motion.div>
            
            {/* Property Timeline */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-sm"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                Property Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-green-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <p className="text-sm text-gray-500">Added to System</p>
                  <p className="font-medium text-gray-700">{new Date(property.created_at).toLocaleDateString("en-GB")}</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-blue-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-700">{new Date(property.created_at).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;