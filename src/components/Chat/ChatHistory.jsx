import React, { useState } from "react";

export default function ChatHistory({
                                        chats = [],
                                        activeSessionId,
                                        onSelectSession,
                                        onDeleteSession,
                                    }) {
    const [confirmSid, setConfirmSid] = useState(null);
    return (
        <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">

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
                    <div
                        key={c.session_id}
                        className={`group relative flex items-center rounded-lg transition-all ${
                            c.session_id === activeSessionId
                                ? "bg-blue-50 border border-blue-200 shadow-sm"
                                : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                        }`}
                    >
                        <button
                            onClick={() => onSelectSession?.(c.session_id)}
                            className="flex-1 text-left p-3 min-w-0"
                        >
                            <div className={`text-sm font-medium truncate ${
                                c.session_id === activeSessionId ? "text-teal-600" : "text-gray-800"
                            }`}>
                                {c.first_message || `Session ${c.session_id}`}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">{c.turns ?? 0} turns</span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-400">{c.language ?? "English"}</span>
                            </div>
                        </button>

                        <div className="relative flex-shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setConfirmSid(c.session_id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 mr-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                                title="Delete chat"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            {confirmSid === c.session_id && (
                                <>
                                    {/* backdrop to close on outside click */}
                                    <div className="fixed inset-0 z-10" onClick={() => setConfirmSid(null)} />
                                    <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-3 w-44">
                                        <p className="text-xs text-gray-600 font-medium mb-2">Delete this chat?</p>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setConfirmSid(null)}
                                                className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-gray-500 text-xs font-medium hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => { setConfirmSid(null); onDeleteSession?.(c.session_id); }}
                                                className="flex-1 px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}