export default function ServerSidebar({
  servers,
  activeServer,
  setActiveServer,
  onCreateServer,
  onJoinServer,
}) {
  return (
    <div className="w-16 bg-gray-950 flex flex-col items-center py-3 gap-2">
      {servers.map((server) => (
        <button
          key={server.id}
          onClick={() => setActiveServer(server)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${
            activeServer?.id === server.id
              ? "bg-indigo-600"
              : "bg-gray-700 hover:bg-indigo-600"
          }`}
        >
          {server.name.slice(0, 2).toUpperCase()}
        </button>
      ))}

      <button
        onClick={onCreateServer}
        className="w-10 h-10 rounded-full mt-1 bg-gray-700 hover:bg-green-600 flex items-center justify-center text-green-500 hover:text-white text-2xl transition-colors"
      >
        +
      </button>

      <button
        onClick={onJoinServer}
        className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center text-white text-xs transition-colors"
      >
        Join
      </button>
    </div>
  );
}