import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // Toggle between Login & Signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        // Signup API Call
        await axios.post("http://localhost:7070/api/auth/signup", { username, email, password });
        setSuccess("Signup successful! Please log in.");
        setMode("login"); // Switch to login mode after successful signup
      } else {
        // Login API Call
        const response = await axios.post("http://localhost:7070/api/auth/login", { email, password });

        //  Store token, userId, and username in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.username);

        navigate("/chat");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 border rounded shadow w-50">
        <h2 className="text-center">{mode === "login" ? "Login" : "Signup"}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Toggle Between Login & Signup */}
        <ToggleButtonGroup type="radio" name="authMode" className="mb-3" value={mode} onChange={setMode}>
          <ToggleButton id="login" value="login" variant="outline-primary">Login</ToggleButton>
          <ToggleButton id="signup" value="signup" variant="outline-secondary">Signup</ToggleButton>
        </ToggleButtonGroup>

        <Form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          )}

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

          <Button type="submit" variant="primary" className="w-100">
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AuthPage;


