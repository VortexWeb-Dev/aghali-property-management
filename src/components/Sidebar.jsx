import React, { useContext, useState } from 'react';
import { Home, Building2, WalletCards, Users2, Wrench, ListPlus, FileStack, HeadphonesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from './../Contexts/SidebarContext';

const MenuItem = ({ icon: Icon, label, isCollapsed, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200
        ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}
      `}  
    >
      <Icon size={20} className={`${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`} />
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium transition-opacity duration-200">
          {label}
        </span>
      )}
    </div>
  );
};

const MenuSection = ({ items, isCollapsed, activeItem, onItemClick }) => {
  const navigate = useNavigate();
  return (
    <div className="py-2">
      {items.map((item) => (
        <MenuItem
        key={item.label}
        icon={item.icon}
        label={item.label}
        isCollapsed={isCollapsed}
        isActive={activeItem === item.label}
        onClick={() => {
          onItemClick(item.label);
          navigate(`/${item.label.toLowerCase()}`);
        }}
        />
      ))}
    </div>
  );
};

const Sidebar = () => {
  // Use the context instead of local state
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const [activeItem, setActiveItem] = useState('Off plan');
  
  const mainMenuItems = [
    { icon: Building2, label: 'Properties' },
    { icon: WalletCards, label: 'Accounting' },
    { icon: Users2, label: 'Contacts' },
    { icon: Wrench, label: 'Maintenance' },
    { icon: ListPlus, label: 'Listings' }
  ];
  
  
  const navigate = useNavigate();
  const bottomMenuItems = [
    { icon: HeadphonesIcon, label: 'Support' },
  ];
  
  return (
    <div 
    className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 ease-in-out flex flex-col z-40
      ${isCollapsed ? 'w-20' : 'w-48'}
      `}
      >
      {/* Header */}
      <button className="flex items-center p-4 ease-in-out" onClick={()=> navigate("/properties")}>
        {isCollapsed ? (
          <img src="logo.png" alt="Behomes" className="h-12 w-12" />
        ) : (
          <img src="user.png" alt="User" className="h-12 w-16" />
        )}
      
      </button>

      {/* Main Menu */}
      <div className="flex-grow">
        <MenuSection
          items={mainMenuItems}
          isCollapsed={isCollapsed}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      </div>

      {/* Bottom Menu */}
      <div className="border-t">
        <MenuSection
          items={bottomMenuItems}
          isCollapsed={isCollapsed}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      </div>
    </div>
  );
};

export default Sidebar;