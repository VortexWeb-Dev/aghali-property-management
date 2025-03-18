import React, { useContext, useState } from 'react';
import { SidebarContext } from './../Contexts/SidebarContext';
import { Menu, X, User, Calendar, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({properties, setProperties}) => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    // Here you would typically pass this filter to your data fetching logic
    console.log("Applying date filter:", dateRange);

    dateRange.startDate && dateRange.endDate && setProperties(properties.filter(property => {
      const propertyDate = new Date(property.created_at); // or property.updated_at
      return propertyDate >= new Date(dateRange.startDate) && propertyDate <= new Date(dateRange.endDate);
    }));

    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateRange({
      startDate: null,
      endDate: null
    });
    // Here you would reset your data to unfiltered state
    console.log("Clearing date filter");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        {/* Hamburger button for Sidebar collapse and expand */}
        <button 
          className="mr-4 hover:text-blue-800 transition-colors"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {
            isCollapsed ?
            <Menu className={`h-8 w-8 text-blue-600 ${isCollapsed ? 'text-gray-500': 'text-blue-600 font-extrabold h-8 w-8'}`}/>
            :
            <X className='text-gray-500 font-extrabold h-8 w-8'/>
          }
        </button>
        <div className="flex items-center">
          <div className="border-r border-gray-300 h-6 mx-4"></div>
          <div className="relative">
            <button 
              className={`text-gray-600 flex items-center ${dateRange.startDate ? 'text-blue-600' : ''}`}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className='h-6 w-6' />
              {(dateRange.startDate || dateRange.endDate) && (
                <span className="ml-2 text-sm">
                  {dateRange.startDate && new Date(dateRange.startDate).toLocaleDateString("en-GB")} 
                  {dateRange.endDate && ` - ${new Date(dateRange.endDate).toLocaleDateString("en-GB")}`}
                </span>
              )}
            </button>

            {/* Date Range Picker */}
            {showDatePicker && (
              <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10 w-64">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={dateRange.startDate || ''} 
                    onChange={handleDateRangeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={dateRange.endDate || ''} 
                    onChange={handleDateRangeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowDatePicker(false)} 
                    className="text-gray-600 mr-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={applyDateFilter}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* X button to clear filter */}
          {(dateRange.startDate || dateRange.endDate) && (
            <button 
              onClick={clearDateFilter} 
              className="ml-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear date filter"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Global Search */}
      
      {/* <div className="w-[70%] mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Type here to search..."
            className="w-full bg-gray-200 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div> */}
      
      <div className="flex items-center">
        <button className="ml-3 p-2 text-gray-600 bg-blue-100 rounded-full" onClick={() => navigate('/profile')}>
          <User className='h-6 w-6' />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
