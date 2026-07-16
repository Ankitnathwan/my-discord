import { useState } from "react";
import RenameChannelModal from "../modals/RenameChannelModal";
import ServerHeader from "../server/ServerHeader";
import MembersList from "./MembersList";

export default function ChannelSidebar({
  activeServer,
  activeChannel,
  setActiveChannel,
  isOwner,
  user,
  onCreateChannel,
  onDeleteChannel,
  onDeleteServer,
  onLogout,
  onLeaveServer,
  onlineUsers,
}) {
  const [editingChannel, setEditingChannel] = useState(null);

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      <ServerHeader
        activeServer={activeServer}
        isOwner={isOwner}
        onDeleteServer={onDeleteServer}
        onLeaveServer={onLeaveServer}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <p className="text-gray-400 text-xs uppercase font-bold px-2 mb-1">
            Channels
          </p>
          
          {activeServer?.channels?.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between group"
            >
              <button
                onClick={() => setActiveChannel(channel)}
                className={`flex-1 text-left px-2 py-1.5 rounded text-sm ${activeChannel?.id === channel.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
                  }`}
              >
                # {channel.name}
              </button>

              {isOwner && (
                <div className="hidden group-hover:flex gap-1">

                  <button
                    onClick={() => setEditingChannel(channel)}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onDeleteChannel(channel.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="8" fill="#fe3155"></circle><polygon fill="#fff" points="11.536,10.121 9.414,8 11.536,5.879 10.121,4.464 8,6.586 5.879,4.464 4.464,5.879 6.586,8 4.464,10.121 5.879,11.536 8,9.414 10.121,11.536"></polygon>
                    </svg>
                  </button>

                </div>
              )}
            </div>
          ))}
        </div>

        {isOwner && (
          <button
            onClick={onCreateChannel}
            className="w-10 h-10 rounded-full mt-1 bg-gray-700 hover:bg-green-600 flex items-center justify-center text-green-500 hover:text-white text-2xl"
          >
            +
          </button>
        )}
      </div>

      <MembersList
        members={activeServer?.allMembers || []}
        onlineUsers={onlineUsers}
      />

      <div className="mt-auto p-3 bg-gray-900 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div

              className={`w-2.5 h-2.5 rounded-full ${onlineUsers.includes(user.id)
                ? "bg-green-500"
                : "bg-gray-500"
                }`}
            />

            <p className="text-sm text-white font-medium">
              {user.displayName}
            </p>

          </div>

          <p className="text-xs text-gray-400">
            @{user.username}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-red-400 text-xs"
        >
          Logout
        </button>
      </div>

      {editingChannel && (
        <RenameChannelModal
          channel={editingChannel}
          onClose={() => setEditingChannel(null)}
        />
      )}

    </div>
  );
}