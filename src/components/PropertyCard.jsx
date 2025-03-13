import {React, useState} from 'react';
import { Link } from 'react-router';
import IndividualProperty from './../pages/IndividualProperty'
import { ChevronRight, Edit } from 'lucide-react';

const PropertyCard = ({ property }) => {

      const [fullView, setFullView] = useState(false)

  // Determine property type label
  const getPropertyTypeLabel = () => {
    if (property.type === "Single Unit") {
      return "SINGLE-FAMILY";
    } else if (property.beds > 1) {
      return `${property.beds} UNITS`;
    }
    return property.type?.toUpperCase() || "SINGLE-FAMILY";
  };

  // Format address
  const formatAddress = () => {
    if (property.address && property.city) {
      return `${property.address}, ${property.city}, ${property.stateOrRegion || ''} ${property.zip || ''}`;
    } else if (property.name) {
      return property.name;
    }
    return "No address provided";
  };

  // Generate placeholder image if no photo is available
  const getPropertyImage = () => {
    if (property.photos && property.photos.length > 0) {
      const imageUrl = property.photos[0];
      console.log(imageUrl);
  
      // Check if URL ends with a valid image extension
      if (/\.(jpeg|jpg|png|gif|webp|svg)$/i.test(imageUrl)) {
        return imageUrl;
      }
    }
    return "";
  };
  

  return (
    <div className="bg-white  shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 w-96 hover:border-4 hover:border-opacity-100 pb-2 rounded-2xl border-blue-600">
      <div className="relative">
        {property.marketRent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Balance د.إ {property.marketRent.toLocaleString()}
          </div>
        )}
        <img 
          src={getPropertyImage() || "image.png"} 
          alt={property.name || "Property"} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {property.name || `Property ${property.id}`}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formatAddress()}
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-700">{getPropertyTypeLabel()}</div>
            <div className="bg-gray-100 py-1 px-3 rounded text-sm text-gray-600">
              {property.beds > 0 && property.beds < 10 ? "OCCUPIED" : "VACANT"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 divide-x border-t">
        <button className="py-3 flex flex-col items-center text-gray-500 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">TENANTS</span>
        </button>
        <button className="py-3 flex flex-col items-center text-gray-500 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs">ACCOUNTING</span>
        </button>
        <button className="py-3 flex flex-col items-center text-gray-500 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs">EQUIPMENT</span>
        </button>
        <button className="py-3 flex flex-col items-center text-gray-500 hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs">MAINTENANCE</span>
        </button>
      </div>

      <div className="flex gap-x-[60%] justify-center">
      <div className="flex justify-end p-3 bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors rounded-xl" >
        <Link className="text-blue-500 hover:text-blue-600 font-medium" to={`/properties?id=${property.id}`}>
        
        <a href="#" className="flex items-center text-sm">
            VIEW
          <ChevronRight className='h-5 w-5'/>
        </a>
        </Link>
      </div>

      </div>
    </div>
  );
};

export default PropertyCard;