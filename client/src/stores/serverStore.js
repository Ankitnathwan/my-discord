import { create } from 'zustand';
import * as serverService from '../services/serverService';
import * as channelService from '../services/channelService';

const useServerStore = create((set, get) => ({
    servers: [],
    activeServer: null,
    activeChannel: null,
    loading: false,
    error: null,

    fetchServers: async () => {
        set({ loading: true });

        try {
            const data = await serverService.fetchServers();

            const currentActive = get().activeServer;

            let updatedActive = null;

            if (currentActive) {
                updatedActive = data.find(
                    (server) => server.id === currentActive.id
                ) || null;
            }

            set({
                servers: data,
                activeServer: updatedActive,
                activeChannel:
                    updatedActive?.channels.find(
                        (c) => c.id === get().activeChannel?.id
                    ) || updatedActive?.channels?.[0] || null,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.message,
                loading: false,
            });
        }
    },

    setActiveServer: (server) => {
        const firstChannel = server?.channels?.[0] || null;
        set({ activeServer: server, activeChannel: firstChannel });
    },

    setActiveChannel: (channel) => set({ activeChannel: channel }),

    createServer: async (formData) => {
        const data = await serverService.createServer(formData);
        set((state) => ({ servers: [...state.servers, data] }));
        return data;
    },

    createChannel: async (serverId, name, type) => {
        const data = await channelService.createChannel({
            name,
            type,
            serverId,
        });
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
        const data = await serverService.joinServer(inviteCode);

        await get().fetchServers();

        const server = get().servers.find((s) => s.id === data.serverId);
        if (server) {
            get().setActiveServer(server);
        }

        return data;
    },

    deleteChannel: async (channelId) => {
        await channelService.deleteChannel(channelId);
        await get().fetchServers();
    },

    deleteServer: async (serverId) => {
        await serverService.deleteServer(serverId);

        const updatedServers = get().servers.filter((s) => s.id !== serverId);

        set({
            servers: updatedServers,
            activeServer:
                get().activeServer?.id === serverId
                    ? updatedServers[0] || null
                    : get().activeServer,
            activeChannel:
                get().activeServer?.id === serverId
                    ? updatedServers[0]?.channels?.[0] || null
                    : get().activeChannel,
        });
    },

}));

export default useServerStore