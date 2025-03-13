import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const StatusUpdateButton = ({ cardId, existingStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const statusOptions = [
    { value: 'Normal', label: 'Normal', color: 'bg-green-500' },
    { value: 'Moderate', label: 'Moderate', color: 'bg-yellow-500' },
    { value: 'Critical', label: 'Critical', color: 'bg-red-500' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusUpdate = async () => {
    try {
      await axios.patch(`https://vortexwebpropertymanagement.com/api/maintenances/${cardId}`, {
        "status": selectedStatus
      });
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
        
      >
        <span>Update Status</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[999] transition-opacity duration-300">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Update Status</h3>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center">
                {selectedStatus && (
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    statusOptions.find(opt => opt.value === selectedStatus)?.color
                  }`}></span>
                )}
                <span className="text-gray-700">
                  {selectedStatus 
                    ? statusOptions.find(opt => opt.value === selectedStatus)?.label 
                    : 'Select new status'}
                </span>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden transform transition-all duration-200 origin-top">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center group transition-all duration-150"
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className={`w-3 h-3 rounded-full mr-2 ${option.color}`}></span>
                    <span className="text-gray-700 group-hover:text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 hover:shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={!selectedStatus}
            className={`h-12 px-6 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
              selectedStatus
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-md transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedStatus ? 'Update Status' : 'Select a status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateButton;