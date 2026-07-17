import { useEffect, useLayoutEffect, useRef } from "react";

export default function ChatArea({
  activeChannel,
  messages,
  message,
  setMessage,
  handleSendMessage,
  handleTyping,
  typingUsers,
  selectedImage,
  setSelectedImage,
}) {
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const previousChannel = useRef(null);

  useLayoutEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  container.scrollTop = container.scrollHeight;
}, [messages, activeChannel?.id]);

  return (
    <div className="flex-1 bg-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-600">
        <p className="text-white font-bold">
          {activeChannel ? `# ${activeChannel.name}` : "Select a channel"}
        </p>
      </div>

      <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
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

              {msg.content && (
                <p className="text-gray-300 text-sm">{msg.content}</p>
              )}

              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="attachment"
                  className="mt-2 rounded-lg max-w-sm cursor-pointer"
                />
              )}

            </div>
          ))
        )}
      </div>

      {typingUsers.length > 0 && (
        <p className="px-4 pb-2 text-sm text-gray-400 italic">
          {typingUsers.join(", ")}{" "}
          {typingUsers.length === 1
            ? "is"
            : "are"}{" "}
          typing...
        </p>
      )}

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedImage(file);
          }
          e.target.value = "";
          inputRef.current?.focus();
        }}
      />

      {activeChannel && (
        <div className="p-4">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                document.getElementById("image-upload").click();
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-3 rounded"
            >
              📷
            </button>
            {selectedImage && (
              <div className="mb-2 text-sm text-gray-300">
                {selectedImage.name}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleTyping}
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