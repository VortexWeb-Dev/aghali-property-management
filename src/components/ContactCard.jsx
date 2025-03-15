import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Phone } from 'lucide-react';
import DeleteEntity from "./DeleteEntity";
import UpdateContactButton from "./UpdateContactsPage";

const ContactCard = ({ contact, setContacts }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  
  const onUpdateContact = async (updatedContact) => {
    try {
      // Make a PUT request to the backend to update the contact
      const response = await axios.patch(
        `https://vortexwebpropertymanagement.com/api/contacts/${updatedContact.id}`,
        updatedContact
      );

      if (response.status === 200) {
        console.log("Contact updated successfully:", response.data);

        // Update the contact in your state (if applicable)
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === updatedContact.id
              ? { ...contact, ...updatedContact }
              : contact
          )
        );

        toast.success("Contact updated successfully!");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.success("Failed to update contact. Please try again.");
    }
  };

  return (
    showModal
    ? 
    <UpdateContactButton
            onUpdateContact={onUpdateContact}
            existingContact={contact}
            showModal={showModal}
            setShowModal={setShowModal}
          />
    :

    <div
      className="rounded-lg shadow-2xl hover:shadow-xl border border-blue-100 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-[#1f386a]-50 relative z-10"
      style={{
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-2 bg-gradient-to-r from-blue-400 to-[#1f386a]"></div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-[#1f386a] flex items-center justify-center text-white text-xl font-medium">
                {contact.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{contact.name}</h3>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          <div 
            className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Mail size={16} />
            </div>
            <div className="text-gray-700 text-sm font-medium overflow-hidden text-ellipsis">
              {contact.email}
            </div>
          </div>
          
          <div 
            className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Phone size={16} />
            </div>
            <div className="text-gray-700 text-sm font-medium">
              {contact.phone}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end items-center mt-6 gap-2">
          <DeleteEntity
            entityName="contacts"
            entityId={contact.id}
            className="h-5 w-5"
          />
          <UpdateContactButton
            onUpdateContact={onUpdateContact}
            existingContact={contact}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCard;