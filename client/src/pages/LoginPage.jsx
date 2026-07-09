import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function LoginPage() {
    const [form, setForm] = useState({ login: '', password: '' })
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const { login } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await login(form);
            navigate('/channels');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        }
    }

    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6">Welcome back!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-xs uppercase font-bold mb1">
                            Email or Username
                        </label>
                        <input
                            type='text'
                            value={form.login}
                            onChange={(e) => setForm({ ...form, login: e.target.value })}
                            className="w-full bg-gray-900 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-1">
                            Password
                        </label>
                        <input
                            type='password'
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full bg-gray-900 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded transition-colors'>
                        Log In
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-4">
                    Need an account?{' '}
                    <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    )
}