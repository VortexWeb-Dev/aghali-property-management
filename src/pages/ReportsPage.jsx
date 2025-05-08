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
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Loader2, Filter, RefreshCcw } from "lucide-react";

// Constants
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#00c49f",
  "#4db6ac",
  "#ff8a65",
  "#9575cd",
];
const BASE_URL = "https://vortexwebpropertymanagement.com/api";

const Dashboard = () => {
  // State
  const [listings, setListings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accounting, setAccounting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          listingsRes,
          propertiesRes,
          maintenanceRes,
          // contactsRes,
          accountingRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/listings`),
          axios.get(`${BASE_URL}/properties`),
          axios.get(`${BASE_URL}/maintenances`),
          // axios.get(`${BASE_URL}/contacts`),
          axios.get(`${BASE_URL}/accountings`),
        ]);

        setListings(listingsRes.data.listings || []);
        setProperties(propertiesRes.data || []);
        setMaintenance(maintenanceRes.data || []);
        // setContacts(contactsRes.data.contacts || []);
        setAccounting(accountingRes.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    const fetchData = async () => {
      try {
        const [
          listingsRes,
          propertiesRes,
          maintenanceRes,
          // contactsRes,
          accountingRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/listings`),
          axios.get(`${BASE_URL}/properties`),
          axios.get(`${BASE_URL}/maintenances`),
          // axios.get(`${BASE_URL}/contacts`),
          axios.get(`${BASE_URL}/accounting`),
        ]);

        setListings(listingsRes.data.listings || []);
        setProperties(propertiesRes.data || []);
        setMaintenance(maintenanceRes.data || []);
        // setContacts(contactsRes.data.contacts || []);
        setAccounting(accountingRes.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  };

  // Data processing functions
  const getListingsByCity = () => {
    const cityCounts = listings.reduce((acc, item) => {
      const city = item.property?.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(cityCounts).map((key) => ({
      name: key,
      value: cityCounts[key],
    }));
  };

  const getListingsByType = () => {
    const typeCounts = listings.reduce((acc, item) => {
      const type = item.property?.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(typeCounts).map((key) => ({
      name: key,
      value: typeCounts[key],
    }));
  };

  const getMaintenanceByStatus = () => {
    const statusCounts = maintenance.reduce((acc, item) => {
      const status = item.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
    }));
  };

  const getMaintenanceByCategory = () => {
    const categoryCounts = maintenance.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(categoryCounts).map((key) => ({
      name: key,
      value: categoryCounts[key],
    }));
  };

  const getContactsByType = () => {
    const typeCounts = contacts.reduce((acc, item) => {
      const type = item.type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(typeCounts).map((key) => ({
      name: key,
      value: typeCounts[key],
    }));
  };

  const getMonthlyListings = () => {
    const monthCounts = listings.reduce((acc, item) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Sort by date
    return Object.entries(monthCounts)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });
  };

  const getMonthlyRevenue = () => {
    const monthlyRevenue = accounting.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    // Sort by date
    return Object.entries(monthlyRevenue)
      .map(([month, amount]) => ({
        month,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });
  };

  const getMonthlyExpenses = () => {
    const monthlyExpenses = accounting.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        const date = new Date(transaction.date);
        const month = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    // Sort by date
    return Object.entries(monthlyExpenses)
      .map(([month, amount]) => ({
        month,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });
  };

  const getIncomeVsExpenses = () => {
    const months = {};

    // Process all transactions
    accounting.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
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

    // Convert to array and sort by date
    return Object.values(months)
      .map((item) => ({
        ...item,
        income: parseFloat(item.income.toFixed(2)),
        expenses: parseFloat(item.expenses.toFixed(2)),
        profit: parseFloat((item.income - item.expenses).toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });
  };

  const getMaintenanceByMonth = () => {
    const monthCounts = maintenance.reduce((acc, item) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Sort by date
    return Object.entries(monthCounts)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });
  };

  const getMaintenanceCostByCategory = () => {
    const categoryCosts = maintenance.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + (parseFloat(item.cost) || 0);
      return acc;
    }, {});

    return Object.keys(categoryCosts).map((key) => ({
      name: key,
      cost: parseFloat(categoryCosts[key].toFixed(2)),
    }));
  };

  const getPropertiesByOccupancyStatus = () => {
    const statusCounts = properties.reduce((acc, item) => {
      const status = item.occupancy_status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
    }));
  };

  const summarizeData = () => {
    return {
      totalProperties: properties.length,
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === "active").length,
      totalMaintenanceRequests: maintenance.length,
      newMaintenanceRequests: maintenance.filter((m) => m.stage === "New")
        .length,
      totalContacts: contacts.length,
      totalRevenue: accounting
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
      totalExpenses: accounting
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
    };
  };

  const summary = summarizeData();

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomFinanceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // UI Components
  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-gray-600 text-lg">Loading dashboard data...</p>
    </div>
  );

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow p-4 border-l-4 border-indigo-500">
        <h3 className="text-gray-500 text-sm font-medium">Properties</h3>
        <p className="text-2xl font-bold text-gray-800">
          {summary.totalProperties}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
        <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
        <p className="text-2xl font-bold text-gray-800">
          {summary.activeListings} of {summary.totalListings}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
        <h3 className="text-gray-500 text-sm font-medium">New Maintenance</h3>
        <p className="text-2xl font-bold text-gray-800">
          {summary.newMaintenanceRequests} of {summary.totalMaintenanceRequests}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
        <h3 className="text-gray-500 text-sm font-medium">Profit</h3>
        <p className="text-2xl font-bold text-gray-800">
          ${(summary.totalRevenue - summary.totalExpenses).toLocaleString()}
        </p>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="flex flex-wrap space-x-2 mb-6 bg-white p-2 rounded-lg shadow">
      {["overview", "properties", "maintenance", "financial"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === tab
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
      <button
        className="ml-auto flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        onClick={refreshData}
        disabled={refreshing}
      >
        <RefreshCcw
          size={16}
          className={`mr-1 ${refreshing ? "animate-spin" : ""}`}
        />
        Refresh
      </button>
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  // Tab content components
  const OverviewTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Listings by City">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getListingsByCity()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getListingsByCity().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Maintenance Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getMaintenanceByStatus()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getMaintenanceByStatus().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Monthly Income vs Expenses">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getIncomeVsExpenses()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomFinanceTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#82ca9d" />
            <Bar dataKey="expenses" name="Expenses" fill="#ff7f7f" />
            <Bar dataKey="profit" name="Profit" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );

  const PropertiesTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Properties by Occupancy Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPropertiesByOccupancyStatus()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getPropertiesByOccupancyStatus().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Listings by Property Type">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getListingsByType()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getListingsByType().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Monthly Listing Activity">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={getMonthlyListings()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              name="Listings"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );

  const MaintenanceTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Maintenance by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getMaintenanceByCategory()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getMaintenanceByCategory().map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Maintenance Costs by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={getMaintenanceCostByCategory()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomFinanceTooltip />} />
              <Legend />
              <Bar dataKey="cost" name="Cost" fill="#ff7f7f" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Monthly Maintenance Requests">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={getMaintenanceByMonth()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Requests"
              stroke="#ff7f7f"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );

  const FinancialTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={getMonthlyRevenue()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomFinanceTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                name="Revenue"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Monthly Expenses">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={getMonthlyExpenses()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomFinanceTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                name="Expenses"
                stroke="#ff7f7f"
                fill="#ff7f7f"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Income vs Expenses">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getIncomeVsExpenses()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomFinanceTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#82ca9d" />
            <Bar dataKey="expenses" name="Expenses" fill="#ff7f7f" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );

  // const ContactsTab = () => (
  //   <>
  //     <ChartContainer title="Contacts by Type">
  //       <ResponsiveContainer width="100%" height={300}>
  //         <PieChart>
  //           <Pie
  //             data={getContactsByType()}
  //             cx="50%"
  //             cy="50%"
  //             labelLine={false}
  //             label={({ name, percent }) =>
  //               `${name}: ${(percent * 100).toFixed(0)}%`
  //             }
  //             outerRadius={100}
  //             fill="#8884d8"
  //             dataKey="value"
  //           >
  //             {getContactsByType().map((_, index) => (
  //               <Cell key={index} fill={COLORS[index % COLORS.length]} />
  //             ))}
  //           </Pie>
  //           <Tooltip content={<CustomTooltip />} />
  //           <Legend />
  //         </PieChart>
  //       </ResponsiveContainer>
  //     </ChartContainer>
  //   </>
  // );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Property Management Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <SummaryCards />
            <TabNavigation />

            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "properties" && <PropertiesTab />}
            {activeTab === "maintenance" && <MaintenanceTab />}
            {activeTab === "financial" && <FinancialTab />}
            {/* {activeTab === "contacts" && <ContactsTab />} */}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
