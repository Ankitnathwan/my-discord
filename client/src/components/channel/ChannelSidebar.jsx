export default function ChannelSidebar({
  activeServer,
  activeChannel,
  setActiveChannel,
  isOwner,
  user,
  onCreateChannel,
  onDeleteChannel,
  onLogout,
}) {
  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      <div className="p-4 font-bold text-white border-b border-gray-900">
        <p>{activeServer ? activeServer.name : "Select a server"}</p>

        {activeServer && (
          <p className="text-xs text-gray-400">
            {activeServer.inviteCode}
          </p>
        )}
      </div>

      <div className="flex-1 p-2">
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
              className={`flex-1 text-left px-2 py-1.5 rounded text-sm ${
                activeChannel?.id === channel.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              # {channel.name}
            </button>

            {isOwner && (
              <button
                onClick={() => onDeleteChannel(channel.id)}
                className="hidden group-hover:block px-2 text-red-400 hover:text-red-300"
              >
                🗑
              </button>
            )}
          </div>
        ))}

        {isOwner && (
          <button
            onClick={onCreateChannel}
            className="w-10 h-10 rounded-full mt-1 bg-gray-700 hover:bg-green-600 flex items-center justify-center text-green-500 hover:text-white text-2xl"
          >
            +
          </button>
        )}
      </div>

      <div className="mt-auto p-3 bg-gray-900 flex items-center justify-between">
        <div>
          <p className="text-sm text-white">{user.displayName}</p>
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
    </div>
  );
}