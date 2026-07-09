import { useEffect } from "react";
import socket from "../lib/socket";

export default function useSocket(activeChannel, setMessages) {
  useEffect(() => {
    if (!activeChannel) return;

    socket.emit("join_channel", activeChannel.id);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [activeChannel, setMessages]);
}