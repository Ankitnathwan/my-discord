import api from "../lib/api";

export const fetchMessages = async (channelId) => {
  const { data } = await api.get(`/messages/${channelId}`);
  return data;
};