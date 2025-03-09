
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";  // ✅ Fixed Case Sensitivity
import ChatPage from "./pages/ChatPage";  
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // ✅ Update state when token changes
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth); // Listen for storage changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Single page for Login & Signup */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ Protect the Chat Page */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* ✅ Redirect "/" to auth page */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* ✅ Catch all unmatched routes and redirect to auth page */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
