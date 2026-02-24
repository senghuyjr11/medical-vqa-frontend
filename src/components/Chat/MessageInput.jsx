import React, { useRef, useState } from "react";

export default function MessageInput({ onSend, loading }) {
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileRef = useRef(null);

    const submit = async () => {
        if (loading) return;
        if (!text.trim() && !imageFile) return;

        // Clear immediately so UI updates right away
        const currentText = text.trim();
        const currentImage = imageFile;

        setText("");
        setImageFile(null);
        if (fileRef.current) fileRef.current.value = "";

        await onSend?.({ text: currentText, imageFile: currentImage });
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="sticky bottom-0 pt-0 pb-3 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Floating pill input box */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple={false}        // ← explicitly single only
                        className="hidden"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        disabled={loading}
                    />

                    {/* Image preview — inside the pill, expands it naturally */}
                    {imageFile && (
                        <div className="px-4 pt-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                                    disabled={loading}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Row 1: Textarea */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={onKeyDown}
                        disabled={loading}
                        rows={2}
                        placeholder="Ask a clinical question..."
                        className="w-full resize-none bg-transparent border-none text-gray-900 placeholder-gray-400 text-base focus:outline-none disabled:opacity-60 px-4 pt-3 pb-1 max-h-40 overflow-y-auto leading-relaxed block"
                        style={{ fieldSizing: "content" }}
                    />

                    {/* Row 2: Action bar */}
                    <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={loading}
                            title="Attach medical image"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={loading || (!text.trim() && !imageFile)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 transition-colors"
                        >
                            {loading ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-2 text-center">
                    For clinical decision support only — not a substitute for professional medical judgment
                </p>
            </div>
        </div>
    );
}