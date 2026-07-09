export default function ChatArea({
  activeChannel,
  messages,
  message,
  setMessage,
  handleSendMessage,
}) {
  return (
    <div className="flex-1 bg-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-600">
        <p className="text-white font-bold">
          {activeChannel ? `# ${activeChannel.name}` : "Select a channel"}
        </p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-3">
              <span className="text-white text-sm font-medium">
                {msg.user.displayName}
              </span>

              <span className="text-gray-400 text-xs ml-2">
                @{msg.user.username}
              </span>

              <p className="text-gray-300 text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      {activeChannel && (
        <div className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder={`Message #${activeChannel.name}`}
              className="flex-1 bg-gray-600 text-white rounded px-4 py-2 text-sm focus:outline-none"
            />

            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}