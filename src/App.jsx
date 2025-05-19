import { useState, useContext, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Properties from "./pages/Properties";
import IndividualProperty from "./pages/IndividualProperty";
import AddProperty from "./pages/AddProperty";
import AccountingPage from "./pages/AccountingPage";
import ContactsPage from "./pages/ContactsPage";
import ListingsPage from "./pages/ListingPage";
import ProfilePage from "./pages/ProfilePage";
import AddListings from "./components/AddListing";
import AddBooking from "./components/AddBooking";
import AddLease from "./components/AddLease";
import SupportPage from "./pages/SupportPage";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import BookingsPage from "./pages/BookingPage";
import LeasesPage from "./pages/LeasePage";

import { SidebarProvider, SidebarContext } from "./Contexts/SidebarContext";
import toast, { Toaster } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import MaintenanceDashboard from "./pages/MaintenancePage";
import EditProfilePage from "./components/EditMainProfile";
import EditInfoPage from "./components/EditProfileInfo";

// Wrapper component to access context
const MainContent = ({ children }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <main
      className={`pt-16 transition-all duration-300 flex-grow bg-gradient-to-br from-blue-50 to-teal-50 ${
        isCollapsed ? "ml-20" : "ml-48"
      }`}
    >
      {children}
    </main>
  );
};

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("https://vortexwebpropertymanagement.com/api/properties")
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  }, []);

  const PropertyResolver = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    return (
      <>
        {id != null ? (
          <IndividualProperty id={id} />
        ) : (
          <Properties data={properties} />
        )}
      </>
    );
  };

  return (
    <>
      <Router>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen">
            <Sidebar />
            <MainContent>
              <Navbar properties={properties} setProperties={setProperties} />
              <Routes>
                <Route path="*" element={<Properties data={properties} />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/properties" element={<PropertyResolver />} />
                <Route path="/properties/add" element={<AddProperty />} />
                <Route path="/accounting" element={<AccountingPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/maintenance" element={<MaintenanceDashboard />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/leases" element={<LeasesPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/listings/add" element={<AddListings />} />
                <Route path="/bookings/add" element={<AddBooking />} />
                <Route path="/leases/add" element={<AddLease />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/profile/edit-profile"
                  element={<EditProfilePage />}
                />
                <Route path="/profile/edit-info" element={<EditInfoPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </MainContent>
          </div>
        </SidebarProvider>
        <Toaster />
      </Router>
      <footer className=" ml-6 bg-blue-900 text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 VortexWeb. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
