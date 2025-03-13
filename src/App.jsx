import { useState, useContext } from "react";
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
import AddListings from "./components/AddListing";
import { SidebarProvider, SidebarContext } from "./Contexts/SidebarContext";
import toast, { Toaster } from 'react-hot-toast';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import MaintenanceDashboard from "./pages/MaintenancePage";

// Wrapper component to access context
const MainContent = ({ children }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <main
      className={`pt-16 transition-all duration-300 flex-grow ${
        isCollapsed ? "ml-20" : "ml-48"
      }`}
    >
      {children}
    </main>
  );
};

function App() {
  const [count, setCount] = useState(0);

  const PropertyResolver = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    return <>{id!=null ? <IndividualProperty id={id} /> : <Properties />}</>;
  };

  return (
    <>
      <Router>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen">
            <Sidebar />
            <MainContent>
              <Navbar />
              <Routes>
                <Route path="*" element={<Properties />} />
                <Route path="/properties" element={<PropertyResolver />} />
                <Route path="/properties/add" element={<AddProperty />} />
                <Route path="/accounting" element={<AccountingPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/maintenance" element={<MaintenanceDashboard />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/add" element={<AddListings />} />
              </Routes>
            </MainContent>
          </div>
        </SidebarProvider>
        <Toaster/>
      </Router>
    </>
  );
}

export default App;
