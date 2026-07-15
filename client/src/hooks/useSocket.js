import { useEffect } from "react";
import socket from "../lib/socket";

export default function useSocket(activeChannel, setMessages, setTypingUsers) {
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
}