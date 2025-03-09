

import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Use environment variable for backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7070";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Disable button while submitting

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Store token, userId, and username in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("username", response.data.username); // ✅ Fixed missing username storage

      navigate("/chat"); // ✅ Redirect to chat page after login
    } catch (err) {
      setError(err.response?.data?.message || "❌ Login failed! Please try again.");
    } finally {
      setLoading(false); // ✅ Re-enable button after request
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="p-4 border rounded shadow w-50">
        <h2 className="text-center mb-4">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading} // ✅ Prevent multiple requests
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary">
              Sign up
            </a>
          </p>
        </Form>
      </div>
    </Container>
  );
};

export default LoginForm;
