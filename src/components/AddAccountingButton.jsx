import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const AddAccountingButton = ({ onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transaction_type: "",
    amount: "",
    transaction_date: "",
    due_date: "",
    payment_status: "",
    payment_method: "",
    invoice_number: "",
    notes: "",
    property: { id: "" },
    tenant: { id: "" },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested property and tenant
    if (name === "property_id") {
      setNewTransaction((prev) => ({
        ...prev,
        property: { id: value },
      }));
    } else if (name === "tenant_id") {
      setNewTransaction((prev) => ({
        ...prev,
        tenant: { id: value },
      }));
    } else {
      setNewTransaction((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Transform dates to ISO string
      const requestPayload = {
        ...newTransaction,
        transaction_date: new Date(
          newTransaction.transaction_date
        ).toISOString(),
        due_date: new Date(newTransaction.due_date).toISOString(),
        amount: parseFloat(newTransaction.amount),
      };

      // Make POST request
      const response = await axios.post(
        "https://vortexwebpropertymanagement.com/api/accountings",
        requestPayload
      );

      // Call parent's add transaction function
      onAddTransaction(response.data);

      // Close modal and reset form
      setShowModal(false);
      setNewTransaction({
        transaction_type: "",
        amount: "",
        transaction_date: "",
        due_date: "",
        payment_status: "",
        payment_method: "",
        invoice_number: "",
        notes: "",
        property: { id: "" },
        tenant: { id: "" },
      });
    } catch (err) {
      console.error("Failed to add transaction", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // properties id/name fetch
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/properties"
        );
        setProperties(response.data);
      } catch (err) {
        console.log("Error while fetching property: ", err);
        toast.error("Error fetching tenants: ", err);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <div className="flow-root">
        <div className="flex float-right">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Transaction</h2>
            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Transaction Type</label>
                  <select
                    name="transaction_type"
                    value={newTransaction.transaction_type}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Type</option>
                    <option value="Rent">Rent</option>
                    <option value="Security Deposit">Security Deposit</option>
                    <option value="Maintenance Charge">
                      Maintenance Charge
                    </option>
                    <option value="Late Fee">Late Fee</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full border rounded p-2"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Transaction Date</label>
                  <input
                    type="datetime-local"
                    name="transaction_date"
                    value={newTransaction.transaction_date}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    name="due_date"
                    value={newTransaction.due_date}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Payment Status</label>
                  <select
                    name="payment_status"
                    value={newTransaction.payment_status}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Payment Method</label>
                  <select
                    name="payment_method"
                    value={newTransaction.payment_method}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Invoice Number</label>
                  <input
                    type="text"
                    name="invoice_number"
                    value={newTransaction.invoice_number}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Enter invoice number"
                  />
                </div>
                <div>
                  <label className="block mb-2">Property</label>

                  <select
                    name="property_id"
                    value={newTransaction.property.id}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    {/* <option value="">Select a tenant</option> */}
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

                <div>
                  <label className="block mb-2">Tenant</label>

                  <select
                    name="tenant"
                    value={newTransaction.tenant.id}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    {/* <option value="">Select a tenant</option> */}
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

              <div>
                <label className="block mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={newTransaction.notes}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 h-24"
                  placeholder="Additional notes"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
                >
                  {isSubmitting ? "Submitting..." : "Add Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAccountingButton;
