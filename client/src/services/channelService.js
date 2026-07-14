import api from "../lib/api";

export const createChannel = async (channelData) => {
  const { data } = await api.post("/channels", channelData);
  return data;
};

export const deleteChannel = async (channelId) => {
  const { data } = await api.delete(`/channels/${channelId}`);
  return data;
};

export const getChannel = async (channelId) => {
  const { data } = await api.get(`/channels/${channelId}`);
  return data;
};

export const renameChannel = async (channelId, name) => {
  const { data } = await api.patch(`/channels/${channelId}`, { name, });
  return data;
};