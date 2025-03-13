import React, { useState, useEffect } from 'react';
import {Plus, Filter} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import PropertyCard from './../components/PropertyCard';


const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://vortexwebpropertymanagement.com/api/properties')
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
        setLoading(false);
      });
  }, []);

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => {
    // Convert search term and property details to lowercase for case-insensitive search
    const term = searchTerm.toLowerCase();
    const name = property.name ? property.name.toLowerCase() : '';
    const address = property.address ? property.address.toLowerCase() : '';
    const city = property.city ? property.city.toLowerCase() : '';
    
    return name.includes(term) || address.includes(term) || city.includes(term);
  });


  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-800">Properties</h1>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Display</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
              <span className="text-sm font-medium text-gray-600">{properties.length} Total</span>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search properties..."
                  className="w-64 bg-white border border-gray-300 rounded-md px-3 py-1.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-2.5 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <button className="flex ml-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Plus className='h-4 w-4'/>
                <span className="ml-1">Import</span>
              </button>
              
              <button className=" flex ml-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Filter className='h-4 w-4'/>
                <span className="ml-1">Filter</span>
              </button>
              
              <button className="flex ml-2 px-4 py-1.5 text-sm bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => navigate("/properties/add")}
              >
                <Plus className='h-6 w-6'/>
                <span>Add property</span>
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 gap-y-3 place-items-center mx-8 mt-8">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;