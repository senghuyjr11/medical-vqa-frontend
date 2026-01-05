// src/components/Chat/MessageInput.jsx
import React, { useRef, useState } from "react";

export default function MessageInput({ onSend, loading }) {
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileRef = useRef(null);

    const submit = async () => {
        if (loading) return;
        if (!text.trim() && !imageFile) return;

        await onSend?.({ text: text.trim(), imageFile });

        setText("");
        setImageFile(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="p-4 bg-gray-900">
            {imageFile && (
                <div className="mb-3 flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3">
                    <div className="text-sm text-gray-200 truncate">
                        Attached: <span className="text-gray-400">{imageFile.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setImageFile(null);
                            if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="text-sm text-red-400 hover:text-red-300"
                        disabled={loading}
                    >
                        Remove
                    </button>
                </div>
            )}

            <div className="flex gap-2 items-end">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    disabled={loading}
                />

                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 disabled:opacity-60"
                    title="Attach image"
                >
                    📎
                </button>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                    rows={2}
                    placeholder="Type your message... (Enter to send, Shift+Enter new line)"
                    className="flex-1 resize-none px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
                />

                <button
                    type="button"
                    onClick={submit}
                    disabled={loading || (!text.trim() && !imageFile)}
                    className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}
