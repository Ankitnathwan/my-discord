import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Field = ({ id, label, type = 'text', required = true, form, setForm, fieldErrors }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>

        <input
            type={type}
            value={form[id]}
            onChange={(e) => setForm({ ...form, [id]: e.target.value })}
            className={`w-full bg-gray-900 text-white rounded px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ${fieldErrors[id]
                ? 'border-red-400 focus:ring-red-400'
                : 'focus:ring-indigo-500'
                }`}
            required={required}
        />

        {fieldErrors[id] && (
            <p className="text-red-400 text-xs mt-1">
                {fieldErrors[id]}
            </p>
        )}
    </div>
);

export default function RegisterPage() {
    const [form, setForm] = useState({
        email: '',
        username: '',
        displayName: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);

        try {
            await register(form);
            navigate('/channels/@me');
        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                const mapped = {};
                data.errors.forEach((e) => {
                    mapped[e.path] = e.msg;
                });
                setFieldErrors(mapped);
            } else {
                setError(data?.error || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        Create an account
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-400 text-red-400 text-sm rounded p-3">
                            {error}
                        </div>
                    )}

                    <Field id="email" label="Email" type="email" form={form} setForm={setForm} fieldErrors={fieldErrors} />
                    <Field id="displayName" label="Display Name" form={form} setForm={setForm} fieldErrors={fieldErrors} />
                    <Field id="username" label="Username" form={form} setForm={setForm} fieldErrors={fieldErrors} />
                    <Field id="password" label="Password" type="password" form={form} setForm={setForm} fieldErrors={fieldErrors} />

                    <p className="text-gray-400 text-xs leading-relaxed">
                        By registering, you agree to our Terms of Service and Privacy Policy.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Continue'}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-4">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-400 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}