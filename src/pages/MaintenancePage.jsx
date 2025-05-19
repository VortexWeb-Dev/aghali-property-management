import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle,Check, X, AlertCircle, Clock, Wrench, ArrowRight } from "lucide-react";
import AddMaintenanceButton from "./../components/AddMaintenanceButton";
import DeleteEntity from "./../components/DeleteEntity";
import StatusUpdateButton from "../components/UpdateModal";

const MaintenanceDashboard = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/maintenances"
        );
        setMaintenanceRequests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // Handler to add new maintenance request to state
  const handleAddMaintenance = (newRequest) => {
    setMaintenanceRequests((prev) => [newRequest, ...prev]);
  };

  const [selectedCard, setSelectedCard] = useState(maintenanceRequests);

  const getStatusIcon = (status) => {
    if (status === "Critical") return <AlertCircle className="w-4 h-4 mr-1" />;
    if (status === "Moderate") return <Clock className="w-4 h-4 mr-1" />;
    if (status === "Normal") return <Check className="w-4 h-4 mr-1" />;
    return <Wrench className="w-4 h-4 mr-1" />;
  };

  const renderCard = (card) => (
    <div
  key={card.id}
  className={`relative border rounded-xl p-6 cursor-pointer transition-all duration-300 group overflow-hidden
    ${
      selectedCard?.id === card.id
        ? "bg-blue-50 border-blue-300 shadow-xl shadow-blue-100"
        : "bg-white border-blue-100 shadow-md hover:shadow-xl hover:border-blue-200 hover:-translate-y-1"
    }
  `}
  onClick={() => setSelectedCard(card)}
>
  {/* Accent corner - similar to the listing card design */}
  <div className="absolute -top-10 -right-10 w-20 h-20  bg-[#1f386a]  rotate-12 transform scale-100 transition-transform duration-500"></div>

  
  {/* Click to Expand hint - enhanced with better styling */}
  <div className="absolute top-3 right-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center shadow-sm z-10">
    <span className="mr-1 font-medium">Details</span>
    <ArrowRight className="w-3 h-3" />
  </div>

  <div className="mb-4 relative z-10">
    {card.category && (
      <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
        {card.category}
      </span>
    )}
    <h2 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">{card.title}</h2>
  </div>

  <p className="text-gray-600 text-sm mb-4 line-clamp-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 relative z-10">
    {card.details?.substring(0, 80)}
    {card.details?.length > 80 ? "..." : ""}
  </p>

  <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-100 relative z-10">
    {/* Status with styling similar to the listing status */}
    {card.status && (
      <div
        className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-full ${
          card.status === "Critical"
            ? "text-red-700 bg-red-50 border border-red-100"
            : card.status === "Moderate"
            ? "text-amber-700 bg-amber-50 border border-amber-100"
            : card.status === "Normal"
            ? "text-blue-700 bg-blue-50 border border-blue-100"
            : "text-gray-700 bg-gray-50 border border-gray-100"
        }`}
      >
        <span className={`w-2 h-2 rounded-full mr-2 ${
          card.status === "Critical"
            ? "bg-red-500 animate-pulse"
            : card.status === "Moderate"
            ? "bg-amber-500 animate-pulse"
            : card.status === "Normal"
            ? "bg-blue-500 animate-pulse"
            : "bg-gray-500"
        }`}></span>
        {getStatusIcon(card.status)}
        {card.status}
      </div>
    )}

    {/* Stage with enhanced styling */}
    {card.stage && (
      <span
        className={`text-xs px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1 ${
          card.stage === "New"
            ? "bg-red-100 text-red-800 border border-red-200"
            : card.stage === "Updated"
            ? "bg-blue-100 text-blue-800 border border-blue-200"
            : card.stage === "Pending"
            ? "bg-amber-100 text-amber-800 border border-amber-200"
            : "bg-gray-100 text-gray-600 border border-gray-200"
        }`}
      >
        {card.stage === "New" && <AlertCircle className="w-3 h-3" />}
        {card.stage === "Updated" && <CheckCircle className="w-3 h-3" />}
        {card.stage === "Pending" && <Clock className="w-3 h-3" />}
        {card.stage}
      </span>
    )}
  </div>
</div>
  );

  if (loading) return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-40 bg-gray-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl text-[#1f386a] font-bold flex items-center">
          
          Maintenance Dashboard
        </h1>
        <div>
          <AddMaintenanceButton onAddMaintenance={handleAddMaintenance} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First row: 1 normal + 1 expanded (spanning 2 cols) */}
        {maintenanceRequests.slice(0, 1).map(renderCard)}
        
        {selectedCard.length !== 0 && (
          <div className="col-span-1 md:col-span-2 row-span-2 border border-blue-200 rounded-xl p-8 shadow-lg bg-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b border-blue-100">
              <h2 className="font-bold text-2xl text-blue-800 mb-4 md:mb-0">{selectedCard.title}</h2>
              <div className="flex gap-3">
                <DeleteEntity
                  entityId={selectedCard.id}
                  entityName="maintenances"
                />
                <StatusUpdateButton cardId={selectedCard.id} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {selectedCard.request_type && (
                  <span className="inline-block text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {selectedCard.request_type}
                  </span>
                )}
                {selectedCard.category && (
                  <span className="inline-block text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {selectedCard.category}
                  </span>
                )}
                {selectedCard.sub_category && (
                  <span className="inline-block text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {selectedCard.sub_category}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Stage:</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCard.stage === "New"
                        ? "bg-red-100 text-red-800"
                        : selectedCard.stage === "Updated"
                        ? "bg-blue-100 text-blue-800"
                        : selectedCard.stage === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedCard.stage || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Status:</span>
                  <span
                    className={`flex items-center font-medium ${
                      selectedCard.status === "Critical"
                        ? "text-red-600"
                        : selectedCard.status === "Moderate"
                        ? "text-amber-600"
                        : selectedCard.status === "Normal"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {getStatusIcon(selectedCard.status)}
                    {selectedCard.status || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">Description</h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedCard.details || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Second row: 1 normal card */}
        {maintenanceRequests.length > 1 ? (
          maintenanceRequests.slice(1, 2).map(renderCard)
        ) : (
          <div className="col-span-1">
            <div className="border border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center text-gray-500 h-full">
              No maintenance requests found
            </div>
          </div>
        )}

        {/* Third row: 1 normal card */}
        {maintenanceRequests.length > 2 ? (
          maintenanceRequests.slice(2).map(renderCard)
        ) : (
          <div className="col-span-1">
            <div className="border border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center text-gray-500 h-full">
              No maintenance requests found
            </div>
          </div>
        )}

        {/* Remaining cards in a 3-column grid */}
        {/* {maintenanceRequests.length > 3 ? (
          maintenanceRequests.slice(3).map(renderCard)
        ) : null} */}
      </div>
    </div>
  );
};

export default MaintenanceDashboard;