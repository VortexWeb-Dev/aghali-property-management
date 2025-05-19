import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Home, User, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateLeasePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    duration_in_months: "",
    status: "active", // default active
    renewal_option: false,
    monthly_rent: "",
    payment_frequency: "monthly", // default monthly
    security_deposit: "",
    last_payment_date: "",
    next_due_date: "",
    lease_agreement: "",
    notes: "",
    property: { id: null },
    tenant: { id: null },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse, tenantResponse] = await Promise.all([
          axios.get("https://vortexwebpropertymanagement.com/api/properties"),
          axios.get("https://vortexwebpropertymanagement.com/api/contacts"),
        ]);
        setProperties(propertyResponse.data);
        setTenants(
          tenantResponse.data.map((tenant) => ({
            id: tenant.id,
            name: tenant.name,
          }))
        );
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLeaseAgreementUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data } = await axios.post(
        "https://vortexwebpropertymanagement.com/api/files/presigned-url",
        {
          key: file.name,
          contentType: file.type,
        }
      );

      // Upload to S3 using pre-signed URL
      await axios.put(data.presignedUrl.presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // Set the uploaded file URL in formData
      const fileUrl = `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;

      setFormData((prev) => ({
        ...prev,
        lease_agreement: fileUrl,
      }));
    } catch (err) {
      console.error("Lease agreement upload failed:", err);
    }
  };

  const handlePropertyChange = (e) => {
    const selectedProperty = properties.find(
      (prop) => prop.id === parseInt(e.target.value, 10)
    ) || {
      id: null,
    };
    setFormData((prevData) => ({
      ...prevData,
      property: { id: selectedProperty.id },
    }));
  };

  const handleTenantChange = (e) => {
    const selectedTenant = tenants.find(
      (tenant) => tenant.id === parseInt(e.target.value, 10)
    ) || {
      id: null,
    };
    setFormData((prevData) => ({
      ...prevData,
      tenant: { id: selectedTenant.id },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare data, parse numeric fields as needed
      const payload = {
        ...formData,
        duration_in_months: parseInt(formData.duration_in_months, 10),
        monthly_rent: parseFloat(formData.monthly_rent),
        security_deposit: parseFloat(formData.security_deposit),
      };

      await axios.post(
        "https://vortexwebpropertymanagement.com/api/lease",
        payload
      );
      navigate("/leases");
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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate("/leases")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leases
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Create New Lease</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Duration in Months */}
              <div className="space-y-2">
                <label
                  htmlFor="duration_in_months"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (Months)
                </label>
                <input
                  type="number"
                  id="duration_in_months"
                  name="duration_in_months"
                  value={formData.duration_in_months}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Renewal Option */}
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="renewal_option"
                  name="renewal_option"
                  checked={formData.renewal_option}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600"
                />
                <label
                  htmlFor="renewal_option"
                  className="text-sm font-medium text-gray-700"
                >
                  Renewal Option
                </label>
              </div>

              {/* Monthly Rent */}
              <div className="space-y-2">
                <label
                  htmlFor="monthly_rent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Monthly Rent
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="monthly_rent"
                  name="monthly_rent"
                  value={formData.monthly_rent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={0}
                  required
                />
              </div>

              {/* Payment Frequency */}
              <div className="space-y-2">
                <label
                  htmlFor="payment_frequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Frequency
                </label>
                <select
                  id="payment_frequency"
                  name="payment_frequency"
                  value={formData.payment_frequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="anually">Annually</option>
                </select>
              </div>

              {/* Security Deposit */}
              <div className="space-y-2">
                <label
                  htmlFor="security_deposit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Security Deposit
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="security_deposit"
                  name="security_deposit"
                  value={formData.security_deposit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={0}
                />
              </div>

              {/* Last Payment Date */}
              <div className="space-y-2">
                <label
                  htmlFor="last_payment_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Payment Date
                </label>
                <input
                  type="date"
                  id="last_payment_date"
                  name="last_payment_date"
                  value={formData.last_payment_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Next Due Date */}
              <div className="space-y-2">
                <label
                  htmlFor="next_due_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Next Due Date
                </label>
                <input
                  type="date"
                  id="next_due_date"
                  name="next_due_date"
                  value={formData.next_due_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Lease Agreement */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label
                  htmlFor="lease_agreement"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lease Agreement File
                </label>
                <input
                  type="file"
                  id="lease_agreement"
                  accept=".pdf,.doc,.docx"
                  onChange={handleLeaseAgreementUpload}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Property */}
              <div className="space-y-2">
                <label
                  htmlFor="property"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property
                </label>
                <select
                  id="property"
                  name="property"
                  value={formData.property.id || ""}
                  onChange={handlePropertyChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a property
                  </option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name ||
                        property.address ||
                        `Property #${property.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tenant */}
              <div className="space-y-2">
                <label
                  htmlFor="tenant"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tenant
                </label>
                <select
                  id="tenant"
                  name="tenant"
                  value={formData.tenant.id || ""}
                  onChange={handleTenantChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a tenant
                  </option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Lease
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLeasePage;
