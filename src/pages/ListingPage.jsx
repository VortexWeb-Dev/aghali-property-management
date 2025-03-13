import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Calendar, Home, Eye, Clock, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteEntity from "../components/DeleteEntity";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ListingsPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/listings"
        );
        const [listingsArray] = response.data;
        const validListings = listingsArray.filter(
          (item) => typeof item === "object" && item !== null
        );
        setListings(validListings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const ListingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(null).map((_, index) => (
        <div key={index} className="bg-white rounded-3xl shadow-lg p-6 space-y-5 border border-blue-100 animate-pulse overflow-hidden relative">
          <div className="h-2 w-16 bg-blue-200 rounded-full absolute top-4 right-4"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton height={24} width={180} className="mb-2" />
              <Skeleton height={20} width={120} />
            </div>
            <Skeleton height={36} width={90} borderRadius={20} />
          </div>
          <Skeleton height={100} width="100%" />
          <div className="flex justify-between items-end">
            <div>
              <Skeleton height={20} width={100} className="mb-2" />
              <Skeleton height={20} width={150} />
            </div>
            <Skeleton height={40} width={40} circle={true} />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="flex justify-between items-center">
        <Skeleton height={46} width={220} borderRadius={12} />
        <Skeleton height={46} width={170} borderRadius={12} />
      </div>
      <ListingSkeleton />
    </div>
  );

  if (error)
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-500 font-medium text-lg">Error: {error}</p>
          </div>
        </div>
      </div>
    );

  const getStatusStyles = (status) => {
    if (status === "Active") {
      return {
        containerClass: "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white ring-1 ring-blue-200 group-hover:ring-blue-500",
        dotClass: "bg-blue-500"
      };
    }
    return {
      containerClass: "bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white ring-1 ring-gray-200 group-hover:ring-gray-500",
      dotClass: "bg-gray-400"
    };
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-[#1f386a] bg-clip-text text-transparent">
            Property Listings
          </h1>
          <p className="text-blue-800/60 mt-1 font-medium">Manage your portfolio of properties</p>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
          onClick={() => navigate("/listings/add")}
        >
          <PlusCircle className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const statusStyles = getStatusStyles(listing.listingStatus);
            
            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 space-y-4 border border-blue-100 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative"
              >
                {/* Accent corner */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#1f386a]  rotate-12 transform  transition-transform duration-500"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      {listing.title}
                    </h3>
                    <div className="flex items-center mt-2 space-x-2 text-blue-700/70">
                      <Tag className="w-4 h-4" />
                      <p className="font-medium">{listing.listingType}</p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${statusStyles.containerClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusStyles.dotClass} animate-pulse`}></span>
                    {listing.listingStatus}
                  </span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent my-3"></div>
                
                <p className="text-gray-600 line-clamp-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">{listing.description}</p>
                
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 transition-all duration-300 group-hover:bg-blue-100/70">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-700/70">Available From</p>
                      <p className="text-gray-700 font-medium">
                        {new Date(listing.availableFrom).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 relative z-10">
                  <button 
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md group"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <div className="transform transition-transform duration-300 hover:scale-110">
                    <DeleteEntity entityName="listings" entityId={listing.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl shadow-xl border border-blue-100">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <Home className="w-16 h-16 text-blue-300" />
          </div>
          <h3 className="text-2xl font-bold text-blue-800 mb-2">No listings found</h3>
          <p className="text-blue-600/70 mb-8 text-center max-w-md">Your property portfolio is empty. Create your first listing to start managing your properties.</p>
          <button
            className="bg-[#1f386a] hover:from-blue-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
            onClick={() => navigate("/listings/add")}
          >
            <PlusCircle className="w-5 h-5" />
            Add Your First Listing
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;