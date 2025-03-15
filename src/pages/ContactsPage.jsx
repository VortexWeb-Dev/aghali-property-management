import React, { useState, useEffect } from "react";
import axios from "axios";
import AddContactButton from "../components/AddContactButton";
import DeleteEntity from "../components/DeleteEntity";
import { motion } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ContactCard from "../components/ContactCard";
import { Phone, Mail, User, Edit } from "lucide-react";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingContact, setIsAddingContact] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/contacts"
        );
        setContacts(response.data);
      } catch (err) {
        setError("Failed to fetch contacts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleAddContact = async (newContact) => {
    try {
      setIsAddingContact(true);
      const response = await axios.post(
        "https://vortexwebpropertymanagement.com/api/contacts",
        newContact
      );
      setContacts((prevContacts) => [...prevContacts, response.data]);
    } catch (err) {
      setError("Failed to add contact");
    } finally {
      setIsAddingContact(false);
    }
  };

  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const ContactSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(null).map((_, index) => (
        <div key={index} className="bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 border border-emerald-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex-shrink-0">
              <Skeleton circle height={48} width={48} />
            </div>
            <div className="flex-1">
              <Skeleton height={24} width="80%" className="mb-2" />
              <Skeleton height={18} width="60%" />
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Skeleton circle height={20} width={20} />
              </div>
              <Skeleton height={18} width="70%" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Skeleton circle height={20} width={20} />
              </div>
              <Skeleton height={18} width="60%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 overflow-x-hidden bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton height={36} width={200} className="mb-2" />
              <Skeleton height={20} width={150} />
            </div>
            <Skeleton height={48} width={120} className="rounded-full" />
          </div>
          <ContactSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md w-full">
          <div className="text-center text-red-500 font-medium text-lg">{error}</div>
          <button 
            className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-hidden bg-gradient-to-br min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 ">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 pb-8"
            >
              Contacts
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              className="text-gray-500 flex items-center gap-2"
            >
              <span>Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-blue-600 font-medium">Contacts</span>
            </motion.div>
          </div>
          <AddContactButton
            onAddContact={handleAddContact}
            isLoading={isAddingContact}
          />
        </div>
        
        {contacts.length === 0 ? (
          <div className="bg-white p-16 rounded-lg shadow text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-emerald-600" />
            </div>
            <div className="text-gray-500 text-xl font-medium">No contacts found</div>
            <p className="text-gray-400 mt-2">Add a new contact to get started</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contacts.map((contact) => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                setContacts={setContacts}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contacts;