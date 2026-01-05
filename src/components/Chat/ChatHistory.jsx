// src/components/Chat/ChatHistory.jsx
import React from "react";

export default function ChatHistory({
                                        chats = [],
                                        activeSessionId,
                                        onSelectSession,
                                        onNewChat,
                                    }) {
    return (
        <div className="w-80 border-r border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Chats</h2>
                <button
                    onClick={onNewChat}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
                >
                    New
                </button>
            </div>

            <div className="space-y-2">
                {chats.map((c) => (
                    <button
                        key={c.session_id}
                        onClick={() => onSelectSession?.(c.session_id)}
                        className={`w-full text-left p-3 rounded border ${
                            c.session_id === activeSessionId
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:bg-gray-800"
                        }`}
                    >
                        <div className="text-sm font-medium">{c.first_message || `Session ${c.session_id}`}</div>
                        <div className="text-xs text-gray-400 mt-1">
                            Turns: {c.turns ?? 0} • {c.language ?? "English"}
                        </div>
                    </button>
                ))}

                {(!chats || chats.length === 0) && (
                    <div className="text-sm text-gray-400">No chats yet.</div>
                )}
            </div>
        </div>
    );
}
