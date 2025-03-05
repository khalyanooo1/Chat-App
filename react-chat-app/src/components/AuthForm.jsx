import { useState } from 'react';
import { signup, login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ type }) {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === 'signup') await signup(formData);
        const { data } = await login(formData);
        localStorage.setItem('token', data.token);
        navigate('/chat');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="p-6 bg-gray-100 shadow-md rounded-xl">
                {type === 'signup' && (
                    <input type="text" placeholder="Username" required
                        className="p-2 border mb-3 w-full"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                )}
                <input type="email" placeholder="Email" required
                    className="p-2 border mb-3 w-full"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input type="password" placeholder="Password" required
                    className="p-2 border mb-3 w-full"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    {type === 'signup' ? 'Sign Up' : 'Login'}
                </button>
            </form>
        </div>
    );
}
