import React, { useContext } from 'react';
import { SidebarContext } from './../Contexts/SidebarContext';
import { Menu, X, Bell, MessageCircle, User, Plus, Filter } from 'lucide-react';

const Navbar = () => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        {/* Hamburger button for Sidebar collapse and expand */}
        <button 
          className={`mr-4  hover:text-blue-800 transition-colors`}
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
          <button className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="w-[70%] mx-4">
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
      </div>
      
      <div className="flex items-center">
        <button className="p-2 text-gray-600 relative">
          <Bell className='h-6 w-6'/>
        </button>
        <button className="ml-3 p-2 text-gray-600">
        <MessageCircle className='h-6 w-6'/>
        </button>
        <button className="ml-3 p-2 text-gray-600 bg-blue-100 rounded-full">
          <User className='h-6 w-6'/>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;