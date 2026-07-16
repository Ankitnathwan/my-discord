import { useEffect } from "react";
import socket from "../lib/socket";
import useAuthStore from "../stores/authStore";

export default function useSocket(activeChannel, setMessages, setTypingUsers, setOnlineUsers) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!activeChannel) return;

    socket.emit("join_channel", activeChannel.id);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleTyping = (user) => {
      setTypingUsers((prev) => {
        if (prev.includes(user)) return prev;
        return [...prev, user];
      });
    };

    const handleStopTyping = (user) => {
      setTypingUsers((prev) =>
        prev.filter((u) => u !== user)
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, [activeChannel, setMessages, setTypingUsers]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("online_users", handleOnlineUsers);

    socket.emit("get_online_users");

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("user_online", user.id);
  }, [user]);

}