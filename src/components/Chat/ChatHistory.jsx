import React from "react";

export default function ChatHistory({
                                        chats = [],
                                        activeSessionId,
                                        onSelectSession,
                                        onNewChat,
                                    }) {
    return (
        <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
            {/* Sidebar header */}
            <div className="px-4 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Conversations</h2>
                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        New
                    </button>
                </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {chats.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        No conversations yet
                    </div>
                )}

                {chats.map((c) => (
                    <button
                        key={c.session_id}
                        onClick={() => onSelectSession?.(c.session_id)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                            c.session_id === activeSessionId
                                ? "bg-blue-50 border border-blue-200 shadow-sm"
                                : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                        }`}
                    >
                        <div className={`text-sm font-medium truncate ${
                            c.session_id === activeSessionId ? "text-blue-700" : "text-gray-800"
                        }`}>
                            {c.first_message || `Session ${c.session_id}`}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{c.turns ?? 0} turns</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400">{c.language ?? "English"}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}