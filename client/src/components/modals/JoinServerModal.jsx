import { useState } from 'react';
import useServerStore from '../../stores/serverStore'

export default function JoinServerModal({ onClose }) {
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('')
    const { joinServer } = useServerStore()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await joinServer(inviteCode.trim())
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid Invite Code');
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-6 pb-0">
                    <h2 className="text-2xl font-bold text-white">Join server</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/20 text-red-400 text-sm rounded p-3">{error}</div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                            Invite code <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="w-full bg-gray-900 text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium">
                            Join Server
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}