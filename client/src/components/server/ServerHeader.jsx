export default function ServerHeader({
    activeServer,
    isOwner,
    onDeleteServer,
    onLeaveServer,
}) {
    return (
        <div className="p-4 border-b border-gray-900">
            <div className="flex items-center justify-between">
                <p className="font-bold text-white">
                    {activeServer ? activeServer.name : "Select a server"}
                </p>

                {activeServer && (
                    isOwner ? (
                        <button
                            onClick={onDeleteServer}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Server"
                        >
                            🗑
                        </button>
                    ) : (
                        <button
                            onClick={onLeaveServer}
                            className="text-yellow-400 hover:text-yellow-300"
                            title="Leave Server"
                        >
                            🚪
                        </button>
                    )
                )}
            </div>

            {activeServer && (
                <p className="text-xs text-gray-400 mt-1">
                    {activeServer.inviteCode}
                </p>
            )}
        </div>
    );
}