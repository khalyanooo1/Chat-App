
import { useState } from 'react';
import { signup, login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ type }) {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // ✅ Disable button while submitting

        try {
            if (type === 'signup') {
                const signupResponse = await signup(formData);
                if (!signupResponse || signupResponse.error) {
                    setError(signupResponse?.error || "Signup failed!");
                    setLoading(false);
                    return;
                }
            }

            // ✅ Login after successful signup (or directly for login)
            const { data } = await login(formData);
            localStorage.setItem('token', data.token);
            navigate('/chat'); // ✅ Redirect to chat after login
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed!");
        } finally {
            setLoading(false); // ✅ Re-enable button after request
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="p-6 bg-gray-100 shadow-md rounded-xl w-80">
                <h2 className="text-center text-xl font-bold mb-4">{type === 'signup' ? "Sign Up" : "Login"}</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {type === 'signup' && (
                    <input type="text" placeholder="Username" required
                        className="p-2 border mb-3 w-full rounded-md focus:ring focus:ring-blue-300"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                )}
                <input type="email" placeholder="Email" required
                    className="p-2 border mb-3 w-full rounded-md focus:ring focus:ring-blue-300"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input type="password" placeholder="Password" required
                    className="p-2 border mb-3 w-full rounded-md focus:ring focus:ring-blue-300"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                    className={`w-full text-white px-4 py-2 rounded-md transition ${
                        loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={loading} // ✅ Prevents multiple requests
                >
                    {loading ? "Processing..." : type === 'signup' ? 'Sign Up' : 'Login'}
                </button>
            </form>
        </div>
    );
}
