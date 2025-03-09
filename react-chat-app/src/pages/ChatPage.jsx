
import { useEffect, useState } from "react";
import { Container, Form, Button, ListGroup, Badge } from "react-bootstrap";
import { io } from "socket.io-client";

// ✅ Use Environment Variable for Backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7070";
const socket = io(BACKEND_URL, { transports: ["websocket"] });

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  useEffect(() => {
    // ✅ Fetch Users
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };

    // ✅ Fetch Messages
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/messages/${username}/${selectedUser}`);
          const data = await res.json();
          setMessages(data);
        } catch (error) {
          console.error("❌ Error fetching messages:", error);
        }
      }
    };

    fetchUsers();
    fetchMessages();

    // ✅ Listen for real-time updates
    socket.on("update-users", fetchUsers);
    socket.on("new-message", (msg) => {
      console.log("📩 New message received:", msg);

      if (
        (msg.sender === username && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === username)
      ) {
        setMessages((prev) => [...prev, msg]); // ✅ Update state only via WebSocket
      }
    });

    socket.emit("user-online", username);

    return () => {
      socket.off("update-users");
      socket.off("new-message");
    };
  }, [selectedUser, username]);

  // ✅ Send Message without Duplicate Updates
  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage = { sender: username, receiver: selectedUser, message, timestamp: new Date() };

      // ✅ Emit Message to Server
      socket.emit("send-message", newMessage);

      // ❌ Remove instant state update to prevent duplication
      setMessage(""); // ✅ Clear input field
    }
  };

  // ✅ Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container className="mt-4">
      <h3>Welcome, {username} 👋</h3>
      <Button
        variant="danger"
        className="float-end"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
        }}
      >
        Logout
      </Button>

      <div className="d-flex mt-3">
        {/* Users List */}
        <ListGroup className="me-4 w-25">
          {users.map((user) => (
            <ListGroup.Item key={user.username} onClick={() => setSelectedUser(user.username)}>
              {user.username}
              <Badge bg={user.online ? "success" : "danger"} className="ms-2">
                {user.online ? "Online" : "Offline"}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Chat Box */}
        <div className="w-75">
          <h5>{selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}</h5>
          <ListGroup style={{ height: "300px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <ListGroup.Item key={index} className={msg.sender === username ? "text-end" : ""}>
                <strong>{msg.sender}:</strong> {msg.message}
                <span className="text-muted ms-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Message Input */}
          <Form className="mt-3 d-flex" onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress} // ✅ Handle Enter key
            />
            <Button variant="primary" className="ms-2" onClick={handleSendMessage}>
              Send
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ChatPage;


