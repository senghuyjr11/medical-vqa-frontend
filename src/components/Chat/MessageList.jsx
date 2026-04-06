import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import apiClient from "../../services/api";

export default function MessageList({
    messages = [],
    responseKey = null,
    loading = false,
    loadingHasImage = false,
}) {
    const bottomRef = useRef(null);
    const [typedText, setTypedText] = useState(null);
    const intervalRef = useRef(null);
    const [remoteImageUrls, setRemoteImageUrls] = useState({});

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Typewriter animation when a new API response arrives
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!responseKey) {
            setTimeout(() => setTypedText(null), 0);
            return;
        }

        const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");
        const fullText = lastAssistantMsg?.content || "";
        if (!fullText) { setTimeout(() => setTypedText(null), 0); return; }

        // Scroll to bottom when response first arrives
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        // Defer setState to avoid synchronous setState-in-effect warning
        const startId = setTimeout(() => {
            let charIndex = 0;
            setTypedText("");

            intervalRef.current = setInterval(() => {
                charIndex = Math.min(charIndex + 5, fullText.length);
                setTypedText(fullText.slice(0, charIndex));

                // Smart scroll: only follow if user is near the bottom
                const container = bottomRef.current?.closest("[data-scroll-container]");
                if (container) {
                    const { scrollTop, scrollHeight, clientHeight } = container;
                    if (scrollHeight - scrollTop - clientHeight < 150) {
                        bottomRef.current?.scrollIntoView({ behavior: "instant" });
                    }
                }

                if (charIndex >= fullText.length) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }, 16);
        }, 0);

        return () => {
            clearTimeout(startId);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [responseKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let isCancelled = false;
        const blobUrlsToRevoke = [];

        const fetchRemoteImages = async () => {
            const remoteMessages = messages
                .map((message, index) => ({ message, index }))
                .filter(({ message }) => !message.localImageUrl && message.imagePath);

            if (remoteMessages.length === 0) {
                setRemoteImageUrls((prev) => {
                    Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
                    return {};
                });
                return;
            }

            const nextUrls = {};

            for (const { message, index } of remoteMessages) {
                try {
                    const normalizedPath = `/${message.imagePath.replace(/^\/+/, "")}`;
                    const response = await apiClient.get(normalizedPath, {
                        responseType: "blob",
                    });

                    const blobUrl = URL.createObjectURL(response.data);
                    blobUrlsToRevoke.push(blobUrl);
                    nextUrls[index] = blobUrl;
                } catch (error) {
                    console.error("load image error:", error);
                }
            }

            if (!isCancelled) {
                setRemoteImageUrls((prev) => {
                    Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
                    return nextUrls;
                });
            } else {
                blobUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
            }
        };

        fetchRemoteImages();

        return () => {
            isCancelled = true;
        };
    }, [messages]);

    const lastAssistantIdx = responseKey !== null
        ? messages.reduce((acc, m, i) => m.role === "assistant" ? i : acc, -1)
        : -1;

    const scanningImageIdx = loading && loadingHasImage
        ? messages.reduce((acc, m, i) => {
            const hasImage = Boolean(m.localImageUrl || m.imagePath);
            return m.role === "user" && hasImage ? i : acc;
        }, -1)
        : -1;

    return (
        <div className="p-6 space-y-5 max-w-4xl mx-auto w-full">
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
                const imageUrl = m.localImageUrl || remoteImageUrls[idx] || null;
                const isAnimating = idx === lastAssistantIdx && typedText !== null;
                const isScanning = idx === scanningImageIdx;
                const content = isAnimating ? typedText : m.content;

                return (
                    <div
                        key={idx}
                        className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} ${isAnimating ? "animate-fade-slide-in" : ""}`}
                    >
                        <div className={`flex flex-col gap-1.5 w-full ${isUser ? "items-end" : "items-start"}`}>

                            {/* Image — sharp corners */}
                            {imageUrl && (
                                <div className={`relative overflow-hidden ${isScanning ? "scan-frame" : ""}`}>
                                    <img
                                        src={imageUrl}
                                        alt="uploaded medical"
                                        className="rounded-none object-contain max-h-64 shadow-sm"
                                    />
                                    {isScanning && (
                                        <>
                                            <div className="pointer-events-none absolute inset-0 bg-teal-500/10" />
                                            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 scan-sweep" />
                                            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-teal-700 shadow-sm">
                                                Scanning image...
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Text bubble */}
                            {content && content !== "[Image Uploaded]" && (
                                <div className={`px-4 py-3 rounded-2xl text-base shadow-md leading-relaxed ${
                                    isUser
                                        ? "bg-teal-600 text-white rounded-xl max-w-[80%]"
                                        : "bg-white border border-slate-200 text-gray-800 rounded-xl max-w-full"
                                }`}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                            em: ({ children }) => <em className="italic">{children}</em>,
                                            a: ({ href, children }) => (
                                                <a href={href} className="underline opacity-80 hover:opacity-100 break-all" target="_blank" rel="noopener noreferrer">
                                                    {children}
                                                </a>
                                            ),
                                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                                            li: ({ children }) => <li className="leading-relaxed mb-1">{children}</li>,
                                            hr: () => <hr className="my-3 border-slate-200" />,
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                                )}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
