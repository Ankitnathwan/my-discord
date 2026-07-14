import { useState } from "react";
import useServerStore from "../../stores/serverStore";

export default function RenameChannelModal({
  channel,
  onClose,
}) {
  const [name, setName] = useState(channel.name);
  const [error, setError] = useState("");

  const { renameChannel } = useServerStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await renameChannel(channel.id, name.trim());
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to rename channel"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">

        <h2 className="text-xl text-white font-bold mb-4">
          Rename Channel
        </h2>

        {error && (
          <p className="text-red-400 mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900 text-white rounded px-3 py-2 mb-4"
          />

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400"
            >
              Cancel
            </button>

            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}