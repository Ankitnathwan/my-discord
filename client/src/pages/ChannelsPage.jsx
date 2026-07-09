import { useEffect, useState } from 'react'
import useServerStore from '../stores/serverStore'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import CreateServerModal from '../components/CreateServerModal'
import CreateChannelModal from '../components/CreateChannelModal'
import JoinServerModal from '../components/JoinServerModal'
import ServerSidebar from "../components/server/ServerSidebar"
import ChannelSidebar from '../components/channel/ChannelSidebar'
import ChatArea from '../components/chat/ChatArea'
import useMessages from "../hooks/useMessages"
import useSocket from "../hooks/useSocket"
import socket from "../lib/socket";

export default function ChannelsPage() {
  const [showCreateServer, setShowCreateServer] = useState(false)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showJoinServer, setShowJoinServer] = useState(false)
  const [message, setMessage] = useState('')
  
  const { servers, activeServer, activeChannel, fetchServers, setActiveServer, setActiveChannel, deleteChannel, } = useServerStore();
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { messages, setMessages } = useMessages(activeChannel);
  const isOwner = activeServer?.ownerId === user.id;

  useEffect(() => {
    fetchServers()
  }, [])

  useSocket(activeChannel, setMessages);

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSendMessage = () => {
  if (!message.trim()) return;

  socket.emit("send_message", {
    channelId: activeChannel.id,
    content: message,
    userId: user.id,
  });

  setMessage("");
};

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm("Delete this channel?")) return;

    try {
      await deleteChannel(channelId);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete channel");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <ServerSidebar
        servers={servers}
        activeServer={activeServer}
        setActiveServer={setActiveServer}
        onCreateServer={() => setShowCreateServer(true)}
        onJoinServer={() => setShowJoinServer(true)}
      />

      <ChannelSidebar
        activeServer={activeServer}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        isOwner={isOwner}
        user={user}
        onCreateChannel={() => setShowCreateChannel(true)}
        onDeleteChannel={handleDeleteChannel}
        onLogout={handleLogout}
      />

      <ChatArea
        activeChannel={activeChannel}
        messages={messages}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />

      {showCreateServer && (
        <CreateServerModal onClose={() => setShowCreateServer(false)} />
      )}

      {showCreateChannel && (
        <CreateChannelModal onClose={() => setShowCreateChannel(false)} />
      )}

      {showJoinServer && (
        <JoinServerModal onClose={() => setShowJoinServer(false)} />
      )}

    </div>
  )
}