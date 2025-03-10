import { useState, useContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; 
import Properties from "./pages/Properties";
import IndividualProperty from "./pages/IndividualProperty";
import { SidebarProvider, SidebarContext } from "./Contexts/SidebarContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useSearchParams,
} from "react-router-dom";

// Wrapper component to access context
const MainContent = ({ children }) => {
  const { isCollapsed } = useContext(SidebarContext);
  
  return (
    <main className={`pt-16 transition-all duration-300 flex-grow ${isCollapsed ? 'ml-20' : 'ml-48'}`}>
      {children}
    </main>
  );
};

function App() {
  const [count, setCount] = useState(0);

  const PropertyResolver = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    console.log(id); // Log the id value to debug what it returns

    return (
      <>
        <IndividualProperty id={id} />
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
              <Navbar />
              <Routes>
                <Route
                  path="*"
                  element={<Properties />}
                />
                <Route path="/properties" element={<PropertyResolver />} />
                {/* <Route path="/accountings" element={<AccountingPage />} />
                <Route path="/contacts" element={<Contacts />} /> */}
              </Routes>
            </MainContent>
          </div>
        </SidebarProvider>
      </Router>
    </>
  );
}

export default App;