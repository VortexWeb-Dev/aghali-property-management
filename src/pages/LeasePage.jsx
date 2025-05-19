import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle,
  Calendar,
  Home,
  Edit,
  DollarSign,
  Repeat,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteEntity from "../components/DeleteEntity";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UpdateLeaseModal from "../components/UpdateLeaseModal";

const LeasesPage = () => {
  const navigate = useNavigate();
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState();

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://vortexwebpropertymanagement.com/api/lease"
      );
      const validLeases = response.data.filter(
        (item) => typeof item === "object" && item !== null
      );
      setLeases(validLeases);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleEditClick = (lease) => {
    setSelectedLease(lease);
    console.log(lease);
    setIsEditModalOpen(true);
  };

  const getStatusStyles = (status) => {
    if (status === "active") {
      return {
        containerClass:
          "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white ring-1 ring-blue-200 group-hover:ring-blue-500",
        dotClass: "bg-blue-500",
      };
    }
    if (status === "expired") {
      return {
        containerClass:
          "bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white ring-1 ring-red-200 group-hover:ring-red-500",
        dotClass: "bg-red-500",
      };
    }
    if (status === "terminated") {
      return {
        containerClass:
          "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-600 group-hover:text-white ring-1 ring-yellow-200 group-hover:ring-yellow-500",
        dotClass: "bg-yellow-500",
      };
    }
    if(status === "upcoming") {
      return {
        containerClass:
          "bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white ring-1 ring-green-200 group-hover:ring-green-500",
        dotClass: "bg-green-500",
      };
    }

    return {
      containerClass:
        "bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white ring-1 ring-gray-200 group-hover:ring-gray-500",
      dotClass: "bg-gray-400",
    };
  };

  const LeaseSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-6 space-y-5 border border-blue-100 animate-pulse"
          >
            <Skeleton height={24} width={180} />
            <Skeleton height={20} width={120} />
            <Skeleton height={100} />
            <Skeleton height={20} width={100} />
            <Skeleton height={40} width={40} circle />
          </div>
        ))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
        <div className="flex justify-between items-center">
          <Skeleton height={46} width={220} borderRadius={12} />
          <Skeleton height={46} width={170} borderRadius={12} />
        </div>
        <LeaseSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md">
          <p className="text-red-500 font-medium text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-[#1f386a] bg-clip-text text-transparent">
            Leases
          </h1>
          <p className="text-blue-800/60 mt-1 font-medium">
            Manage your leases
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition hover:shadow-xl hover:-translate-y-1"
          onClick={() => navigate("/leases/add")}
        >
          <PlusCircle className="w-5 h-5" />
          Add New Lease
        </button>
      </div>

      {leases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leases.map((lease) => {
            const statusStyles = getStatusStyles(lease.status);

            return (
              <div
                key={lease.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 space-y-4 border border-blue-100 transition hover:-translate-y-2 group"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${statusStyles.containerClass}`}
                >
                  <div
                    className={`w-2 h-2 inline-block rounded-full mr-2 ${statusStyles.dotClass}`}
                  />
                  {lease.status || "Unknown"}
                </div>

                {/* Notes */}
                <p className="text-gray-600 line-clamp-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  {lease.notes || "No notes"}
                </p>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl">
                    <Calendar className="text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700/70">Start</p>
                      <p className="font-medium text-gray-700">
                        {new Date(lease.start_date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl">
                    <Calendar className="text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700/70">End</p>
                      <p className="font-medium text-gray-700">
                        {new Date(lease.end_date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property and Tenant */}
                <div className="bg-white p-3 rounded-2xl shadow border border-gray-100">
                  <p className="text-sm text-gray-500">
                    Property:{" "}
                    <span className="font-medium text-gray-800">
                      {lease.property?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tenant:{" "}
                    <span className="font-medium text-gray-800">
                      {lease.tenant?.name || "N/A"}
                    </span>
                  </p>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl">
                    <DollarSign className="text-green-600" />
                    <div>
                      <p className="text-xs text-green-800/70">Rent</p>
                      <p className="font-medium text-gray-800">
                        {lease.monthly_rent
                          ? `AED ${lease.monthly_rent}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-xl">
                    <Repeat className="text-yellow-600" />
                    <div>
                      <p className="text-xs text-yellow-800/70">Frequency</p>
                      <p className="font-medium text-gray-800">
                        {lease.payment_frequency || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl">
                    <ShieldCheck className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-indigo-800/70">Deposit</p>
                      <p className="font-medium text-gray-800">
                        {lease.security_deposit
                          ? `AED ${lease.security_deposit}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(lease)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition transform hover:scale-110"
                    title="Edit Lease"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <DeleteEntity entityName="lease" entityId={lease.id} />
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
          <h3 className="text-2xl font-bold text-blue-800 mb-2">
            No leases found
          </h3>
          <p className="text-blue-600/70 mb-8 text-center max-w-md">
            Your property portfolio is empty. Create your first lease to start
            managing your properties.
          </p>
          <button
            className="bg-[#1f386a] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#18315a]"
            onClick={() => navigate("/leases/add")}
          >
            Add Your First Lease
          </button>
        </div>
      )}

      <UpdateLeaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        singleLease={selectedLease}
        onUpdated={fetchLeases}
      />
    </div>
  );
};

export default LeasesPage;
