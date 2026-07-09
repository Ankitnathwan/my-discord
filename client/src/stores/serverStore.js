import { create } from 'zustand';
import api from '../lib/api';

const useServerStore = create((set, get) => ({
    servers: [],
    activeServer: null,
    activeChannel: null,
    loading: false,
    error: null,

    fetchServers: async () => {
        set({ loading: true });
        try {
            const { data } = await api.get('/servers');
            set({ servers: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    setActiveServer: (server) => {
        const firstChannel = server?.channels?.[0] || null;
        set({ activeServer: server, activeChannel: firstChannel });
    },

    setActiveChannel: (channel) => set({ activeChannel: channel }),

    createServer: async (formData) => {
        const { data } = await api.post('/servers', formData);
        set((state) => ({ servers: [...state.servers, data] }));
        return data;
    },

    createChannel: async (serverId, name, type) => {
        const { data } = await api.post('/channels', { name, type, serverId });
        set((state) => ({
            servers: state.servers.map((s) =>
                s.id === serverId ? { ...s, channels: [...s.channels, data] } : s
            ),
            activeServer:
                state.activeServer?.id === serverId
                    ? { ...state.activeServer, channels: [...state.activeServer.channels, data] }
                    : state.activeServer,
        }));
        return data;
    },

    joinServer: async (inviteCode) => {
        const { data } = await api.post(`/servers/join/${inviteCode}`);

        await get().fetchServers();

        const server = get().servers.find((s) => s.id === data.serverId);
        if (server) {
            get().setActiveServer(server);
        }

        return data;
    },

}));

export default useServerStore