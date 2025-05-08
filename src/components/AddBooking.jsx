import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Home, User, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    notes: "",
    start_date: "",
    end_date: "",
    property: {
      id: null,
      name: "",
    },
    tenant: {
      id: null,
      name: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse] = await Promise.all([
          axios.get("https://vortexwebpropertymanagement.com/api/properties"),
        ]);
        setProperties(propertyResponse.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const [tenants, setTenants] = useState([]);
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/contacts"
        );
        const simplifiedTenants = response.data.map((tenant) => ({
          id: tenant.id,
          name: tenant.name,
        }));
        setTenants(simplifiedTenants);
      } catch (err) {
        console.log("Error while fetching tenants: ", err);
        toast.error("Error fetching tenants: ", err);
      }
    };

    fetchTenants();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handlePropertyChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     property: properties.find((prop) => prop.id === parseInt(e.target.value)),
  //   });
  // };

  const handlePropertyChange = (e) => {
    const selectedProperty = properties.find(
      (prop) => prop.id === parseInt(e.target.value, 10)
    ) || { id: null };

    setFormData((prevData) => ({
      ...prevData,
      property: { id: selectedProperty.id },
    }));
  };

  const handleListerChange = (e) => {
    const selectedLister = tenants.find(
      (tenant) => tenant.id === parseInt(e.target.value, 10)
    ) || { id: null };

    setFormData((prevData) => ({
      ...prevData,
      tenant: { id: selectedLister.id },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(formData);
      await axios.post(
        "https://vortexwebpropertymanagement.com/api/bookings",
        formData
      );
      navigate("/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg shadow-md text-center mx-auto max-w-lg mt-10">
        <div className="font-bold mb-2">Error</div>
        <div>{error}</div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">
              Create New Booking
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label
                  htmlFor="property"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="property"
                    name="property"
                    value={formData.property.id}
                    onChange={handlePropertyChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a property</option>
                    {properties.length > 0 ? (
                      properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No properties found</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tenant"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tenant
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="tenant"
                    name="tenant"
                    value={formData.tenant?.id || ""}
                    onChange={handleListerChange}
                    // {(e) => {
                    //   setFormData({
                    //     ...formData,
                    //     tenant: tenants.find(
                    //       (tenant) => tenant.id === parseInt(e.target.value)
                    //     ),
                    //   });
                    // }}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a person</option>
                    {tenants.length > 0 ? (
                      tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No tenants found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter any additional notes here..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors font-medium flex items-center"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;
