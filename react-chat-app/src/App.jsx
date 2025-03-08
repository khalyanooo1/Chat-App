import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authpage";  
import ChatPage from "./pages/ChatPage";  
import "bootstrap/dist/css/bootstrap.min.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Single page for Login & Signup */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protect the Chat Page */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Redirect "/" to auth page */}
        <Route path="/" element={<Navigate to="/auth" />} />
        
        {/* Catch all unmatched routes and redirect to auth page */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;


