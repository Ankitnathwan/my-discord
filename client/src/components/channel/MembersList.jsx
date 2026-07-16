import useAuthStore from "../../stores/authStore";

export default function MembersList({
    members,
    onlineUsers,
}) {
    const { user } = useAuthStore();

    const visibleMembers = members.filter(
        (member) => member.id !== user.id
    );

    return (
        <div className="border-t border-gray-900 p-2">
            <p className="text-xs uppercase text-gray-400 font-bold mb-2 px-2">
                Members
            </p>

            {visibleMembers.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
                >
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${onlineUsers.includes(member.id)
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                    />

                    <span className="text-sm text-white">
                        {member.displayName}
                    </span>
                </div>
            ))}
        </div>
    );
}