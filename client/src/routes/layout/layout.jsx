import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Layout component for the overall page structure
function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

// RequireAuth component to protect routes that need authentication
function RequireAuth() {
  // Context to get the current user
  const { currentUser } = useContext(AuthContext);

  // If there is no current user, navigate to the login page
  if (!currentUser) return <Navigate to="/login" />;
  else {
    // If there is a current user, render the layout
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };
