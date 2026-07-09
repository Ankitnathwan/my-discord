import api from "../lib/api";

export const fetchServers = async () => {
  const { data } = await api.get("/servers");
  return data;
};

export const createServer = async (serverData) => {
  const { data } = await api.post("/servers", serverData);
  return data;
};

export const joinServer = async (inviteCode) => {
  const { data } = await api.post(`/servers/join/${inviteCode}`);
  return data;
};

export const deleteServer = async (serverId) => {
  const { data } = await api.delete(`/servers/${serverId}`);
  return data;
};