import { useEffect, useState } from 'react'
import useServerStore from '../stores/serverStore'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import CreateServerModal from '../components/CreateServerModal'
import socket from '../lib/socket'
import api from '../lib/api'

export default function ChannelsPage() {
  const [showCreateServer, setShowCreateServer] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { servers, activeServer, activeChannel, fetchServers, setActiveServer, setActiveChannel } = useServerStore()
  useEffect(() => {
    fetchServers()
  }, [])

  useEffect(() => {
    if (!activeChannel) return
    setMessages([])

    // fetch existing messages
    api.get(`/messages/${activeChannel.id}`)
      .then(({ data }) => setMessages(data))
      .catch(console.error)

    socket.emit('join_channel', activeChannel.id)

    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('new_message')
    }
  }, [activeChannel])

  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    socket.emit('send_message', {
      channelId: activeChannel.id,
      content: message,
      userId: user.id
    })

    setMessage('')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Server list */}
      <div className="w-16 bg-gray-950 flex flex-col items-center py-3 gap-2">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${activeServer?.id === server.id ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-indigo-600'
              }`}
          >
            {server.name.slice(0, 2).toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setShowCreateServer(true)}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center text-green-500 hover:text-white text-2xl transition-colors"
        >
          +
        </button>
      </div>

      {/* Channel sidebar */}
      <div className="w-60 bg-gray-800 flex flex-col">
        <div className="p-4 font-bold text-white border-b border-gray-900">
          <p className="font-bold text-white">{activeServer ? activeServer.name : 'Select a server'}</p>
          {activeServer && (
            <p className="text-xs text-gray-400">{activeServer.inviteCode}</p>
          )}
        </div>

        <div className="flex-1 p-2">
          <p className="text-gray-400 text-xs uppercase font-bold px-2 mb-1">Channels</p>
          {activeServer?.channels?.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm ${activeChannel?.id === channel.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              # {channel.name}
            </button>
          ))}
        </div>
        <div className="mt-auto p-3 bg-gray-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 text-xs"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-700 flex flex-col">
        {/* Channel header */}
        <div className="p-4 border-b border-gray-600">
          <p className="text-white font-bold">
            {activeChannel ? `# ${activeChannel.name}` : 'Select a channel'}
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-3">
                <span className="text-white text-sm font-medium">{msg.user.displayName}</span>
                <span className="text-gray-400 text-xs ml-2">@{msg.user.username}</span>
                <p className="text-gray-300 text-sm">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Message input */}
        {activeChannel && (
          <div className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder={`Message #${activeChannel.name}`}
                className="flex-1 bg-gray-600 text-white rounded px-4 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateServer && (
        <CreateServerModal onClose={() => setShowCreateServer(false)} />
      )}

    </div>
  )
}