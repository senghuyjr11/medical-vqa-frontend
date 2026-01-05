// src/components/Chat/MessageList.jsx
import React from "react";

export default function MessageList({ messages = [] }) {
    return (
        <div className="p-6 space-y-4">
            {messages.length === 0 && (
                <div className="text-gray-400 text-sm">
                    Send a question (and optionally an image) to start.
                </div>
            )}

            {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                    <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-3xl px-4 py-3 rounded-2xl border whitespace-pre-wrap leading-relaxed ${
                                isUser
                                    ? "bg-blue-600/20 border-blue-500 text-white"
                                    : "bg-gray-800 border-gray-700 text-gray-100"
                            }`}
                        >
                            {m.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
