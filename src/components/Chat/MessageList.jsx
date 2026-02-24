import React from "react";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "../../services/api";

export default function MessageList({ messages = [] }) {
    return (
        <div className="p-6 space-y-5 max-w-3xl mx-auto w-full">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-medium text-lg">Ask a clinical question</p>
                    <p className="text-gray-400 text-base mt-1">You can also attach a medical image for visual analysis</p>
                </div>
            )}

            {messages.map((m, idx) => {
                const isUser = m.role === "user";
                const imageUrl = m.imagePath ? `${API_BASE_URL}/${m.imagePath}` : null;

                return (
                    <div key={idx} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`flex flex-col gap-1.5 max-w-2xl ${isUser ? "items-end" : "items-start"}`}>

                            {/* Image — sharp corners */}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="uploaded medical"
                                    className="rounded-none object-contain max-h-64 shadow-sm"
                                />
                            )}

                            {/* Text bubble */}
                            {m.content && m.content !== "[Image Uploaded]" && (
                                <div className={`px-4 py-3 rounded-xl text-base shadow-md leading-relaxed ${
                                    isUser
                                        ? "bg-teal-600 text-white rounded-tr-sm"
                                        : "bg-white border border-slate-200 text-gray-800 rounded-tl-sm"
                                }`}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                            a: ({ href, children }) => (
                                                <a href={href} className="underline opacity-80 hover:opacity-100 break-all" target="_blank" rel="noopener noreferrer">
                                                    {children}
                                                </a>
                                            ),
                                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}