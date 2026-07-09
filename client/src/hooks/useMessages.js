import { useEffect, useState } from "react";
import * as messageService from "../services/fetchMessages";

export default function useMessages(activeChannel) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!activeChannel) return;

    setMessages([]);

    messageService
      .fetchMessages(activeChannel.id)
      .then(setMessages)
      .catch(console.error);
  }, [activeChannel]);

  return {
    messages,
    setMessages,
  };
}