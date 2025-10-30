import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./Front-end/Sidebar";
import Dashboard from "./Front-end/Dashboard";
import StockCard from "./Front-end/StockCard";
import Profile from "./Front-end/Profile";
import User from "./Front-end/User";
import RIS from "./Front-end/RIS";
import Office from "./Front-end/Office";
import ItemManagement from "./Front-end/ItemManagement";
import Supplier from "./Front-end/Supplier";
import Category from "./Front-end/Category";
import Login from "./Front-end/Login";
import ProtectedRoute from "./Front-end/ProtectedRoute";

function AppLayout({ open, setOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {!isLoginPage && <Sidebar open={open} setOpen={setOpen} />}

      <div
        className={`flex flex-1 overflow-y-auto ${isLoginPage ? "" : "p-2"}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="stockcard"
            element={
              <ProtectedRoute>
                <StockCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="ris"
            element={
              <ProtectedRoute>
                <RIS />
              </ProtectedRoute>
            }
          />
          <Route
            path="office"
            element={
              <ProtectedRoute>
                <Office />
              </ProtectedRoute>
            }
          />
          <Route
            path="itemManagement"
            element={
              <ProtectedRoute>
                <ItemManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="supplier"
            element={
              <ProtectedRoute>
                <Supplier />
              </ProtectedRoute>
            }
          />
          <Route
            path="category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(true);

  return (
    <Router>
      <AppLayout open={open} setOpen={setOpen} />
    </Router>
  );
}

export default App;
