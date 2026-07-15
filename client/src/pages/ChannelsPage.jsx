import { useEffect, useState, useRef } from 'react'
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
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);

  const { servers, activeServer, activeChannel, fetchServers, setActiveServer, setActiveChannel, deleteChannel, deleteServer, leaveServer, } = useServerStore();
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { messages, setMessages } = useMessages(activeChannel);
  const isOwner = activeServer?.ownerId === user.id;

  useEffect(() => {
    fetchServers()
  }, [])

  useSocket(activeChannel, setMessages, setTypingUsers);

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

    socket.emit("typing_stop", {
      channelId: activeChannel.id,
      user: user.displayName,
    });

    clearTimeout(typingTimeout.current);

    setMessage("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!value.trim()) {
      socket.emit("typing_stop", {
        channelId: activeChannel.id,
        user: user.displayName,
      });
      return;
    }

    socket.emit("typing_start", {
      channelId: activeChannel.id,
      user: user.displayName,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", {
        channelId: activeChannel.id,
        user: user.displayName,
      });
    }, 1000);
  };

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm("Delete this channel?")) return;

    try {
      await deleteChannel(channelId);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete channel");
    }
  };

  const handleDeleteServer = async () => {
    if (!activeServer) return;

    if (!window.confirm(`Delete "${activeServer.name}"?`)) return;

    try {
      await deleteServer(activeServer.id);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete server");
    }
  };

  const handleLeaveServer = async () => {
    if (!activeServer) return;

    if (
      !window.confirm(
        `Leave "${activeServer.name}"?`
      )
    ) {
      return;
    }

    try {
      await leaveServer(activeServer.id);
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Failed to leave server"
      );
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
        onDeleteServer={handleDeleteServer}
        onLeaveServer={handleLeaveServer}
      />

      <ChatArea
        activeChannel={activeChannel}
        messages={messages}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        typingUsers={typingUsers}
        handleTyping={handleTyping}
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