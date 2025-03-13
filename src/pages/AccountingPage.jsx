import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUp, ArrowDown, Plus, Trash2, Filter, Download, Calendar, DollarSign, CreditCard } from "lucide-react";
import AddAccountingButton from "./../components/AddAccountingButton";
import DeleteEntity from "../components/DeleteEntity";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AccountingPage = () => {
  const [accountings, setAccountings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountings = async () => {
      try {
        const response = await axios.get(
          "https://vortexwebpropertymanagement.com/api/accountings"
        );
        setAccountings(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountings();
  }, []);

  const handleAddTransaction = (newTransaction) => {
    setAccountings((prev) => [newTransaction, ...prev]);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  const SkeletonTable = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-blue-50">
            {["Transaction Type", "Amount", "Transaction Date", "Due Date", "Status", "Payment Method", "Invoice #", "Notes", ""].map((header, index) => (
              <th key={index} className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">
                <Skeleton width={100} height={24} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(5).fill(null).map((_, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              {Array(9).fill(null).map((__, cellIndex) => (
                <td key={cellIndex} className="p-4 border-b border-dashed border-blue-200">
                  <Skeleton height={24} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-blue-800">
            <Skeleton width={200} height={32} />
          </h1>
          <div className="flex justify-between items-center mb-6">
            <div><Skeleton width={150} height={40} /></div>
            <div className="flex gap-2">
              <Skeleton width={40} height={40} circle />
              <Skeleton width={40} height={40} circle />
            </div>
          </div>
          <SkeletonTable />
        </div>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="p-6 bg-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="p-6 text-red-500 text-center bg-red-50 rounded-lg border border-red-200">
              <p className="text-lg font-medium">Error: {error}</p>
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
          


          </div>

          <div className="bg-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-blue-800">View Accountings</h1>

            </div>
            <div className="flex gap-4">
            <div className="flex items-center gap-3">
             
            <AddAccountingButton onAddTransaction={handleAddTransaction} />


            </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Transaction Type</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Amount</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Transaction Date</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Due Date</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Status</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Payment Method</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Invoice #</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200">Notes</th>
                  <th className="p-4 text-left text-blue-800 font-semibold border-b border-dashed border-blue-200"></th>
                </tr>
              </thead>
              <tbody>
                {accountings.length > 0 ? (
                  accountings.map((accounting, index) => (
                    <tr key={accounting.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100 transition-colors"}>
                      <td className="p-4 border-b border-dashed border-blue-200 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={`p-2 rounded-full ${accounting.transaction_type?.toLowerCase().includes('income') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {accounting.transaction_type?.toLowerCase().includes('income') ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                          </span>
                          {accounting.transaction_type}
                        </div>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200 font-bold">
                        <span className={accounting.transaction_type?.toLowerCase().includes('income') ? 'text-blue-700' : 'text-red-700'}>
                          {formatCurrency(accounting.amount)}
                        </span>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-700" />
                          {new Date(accounting.transaction_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-700" />
                          {new Date(accounting.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(accounting.payment_status)}`}>
                          {accounting.payment_status}
                        </span>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-blue-700" />
                          {accounting.payment_method}
                        </div>
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        {accounting.invoice_number}
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200 max-w-xs truncate">
                        {accounting.notes}
                      </td>
                      <td className="p-4 border-b border-dashed border-blue-200">
                        <div className="flex justify-end">
                          <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 bg-blue-50 rounded-full">
                          <DollarSign size={32} className="text-blue-600" />
                        </div>
                        <p className="font-medium">No transactions found</p>
                        <p className="text-sm">Click the add button to create your first transaction</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;