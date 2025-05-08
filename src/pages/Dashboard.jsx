import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Loader2, Home, ClipboardList, Wrench, DollarSign, Users, ExternalLink } from "lucide-react";

// Constants
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];
const BASE_URL = "https://vortexwebpropertymanagement.com/api";

const Dashboard = () => {
  // State
  const [summary, setSummary] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalListings: 0,
    newMaintenanceRequests: 0,
    totalMaintenanceRequests: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [maintenanceByStatus, setMaintenanceByStatus] = useState([]);
  const [incomeVsExpenses, setIncomeVsExpenses] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          listingsRes,
          propertiesRes,
          maintenanceRes,
          accountingRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/listings`),
          axios.get(`${BASE_URL}/properties`),
          axios.get(`${BASE_URL}/maintenances`),
          axios.get(`${BASE_URL}/accountings`),
        ]);

        // Process maintenance status data
        const maintenance = maintenanceRes.data || [];
        const statusCounts = maintenance.reduce((acc, item) => {
          const status = item.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const maintenanceStats = Object.keys(statusCounts).map((key) => ({
          name: key,
          value: statusCounts[key],
        }));

        // Process financial data
        const accounting = accountingRes.data.transactions || [];
        const months = {};
        
        accounting.forEach((transaction) => {
          const date = new Date(transaction.date);
          const monthKey = date.toLocaleString("default", {
            month: "short",
          });

          if (!months[monthKey]) {
            months[monthKey] = { month: monthKey, income: 0, expenses: 0 };
          }

          if (transaction.type === "income") {
            months[monthKey].income += parseFloat(transaction.amount);
          } else if (transaction.type === "expense") {
            months[monthKey].expenses += parseFloat(transaction.amount);
          }
        });

        const financialStats = Object.values(months)
          .map((item) => ({
            ...item,
            income: parseFloat(item.income.toFixed(2)),
            expenses: parseFloat(item.expenses.toFixed(2)),
          }))
          .slice(-3); // Just show last 3 months
          
        // Update state
        setMaintenanceByStatus(maintenanceStats);
        setIncomeVsExpenses(financialStats);
        
        const listings = listingsRes.data.listings || [];
        const properties = propertiesRes.data || [];
        
        setSummary({
          totalProperties: properties.length,
          totalListings: listings.length,
          activeListings: listings.filter((l) => l.status === "active").length,
          totalMaintenanceRequests: maintenance.length,
          newMaintenanceRequests: maintenance.filter((m) => m.stage === "New").length,
          totalRevenue: accounting
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
          totalExpenses: accounting
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded-md text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.dataKey === "income" || entry.dataKey === "expenses" 
                ? `$${entry.value.toLocaleString()}` 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const QuickLink = ({ to, icon, label, color }) => (
    <a 
      href={to} 
      className={`flex items-center p-3 rounded-lg shadow-sm transition-all hover:shadow ${color} text-white`}
    >
      {icon}
      <span className="ml-2 font-medium">{label}</span>
      <ExternalLink size={14} className="ml-auto" />
    </a>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Property Management</h2>
        <a href="/reports" className="text-indigo-600 text-sm hover:underline flex items-center">
          Full Reports <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <QuickLink 
          to="/listings" 
          icon={<ClipboardList size={16} />} 
          label="Listings" 
          color="bg-indigo-600"
        />
        <QuickLink 
          to="/properties" 
          icon={<Home size={16} />} 
          label="Properties" 
          color="bg-green-600"
        />
        <QuickLink 
          to="/maintenance" 
          icon={<Wrench size={16} />} 
          label="Maintenance" 
          color="bg-amber-600"
        />
        <QuickLink 
          to="/accounting" 
          icon={<DollarSign size={16} />} 
          label="Accounting" 
          color="bg-blue-600"
        />
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-xs text-gray-500">Properties</p>
          <p className="text-xl font-bold text-gray-800">{summary.totalProperties}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Active Listings</p>
          <p className="text-xl font-bold text-gray-800">{summary.activeListings}/{summary.totalListings}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">New Maintenance</p>
          <p className="text-xl font-bold text-gray-800">{summary.newMaintenanceRequests}/{summary.totalMaintenanceRequests}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Profit</p>
          <p className="text-xl font-bold text-gray-800">${(summary.totalRevenue - summary.totalExpenses).toLocaleString()}</p>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Status Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Maintenance Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintenanceByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {maintenanceByStatus.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Financial Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Financial Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeVsExpenses}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#82ca9d" />
                <Bar dataKey="expenses" name="Expenses" fill="#ff7f7f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Dashboard;