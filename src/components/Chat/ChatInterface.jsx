// src/components/Chat/ChatInterface.jsx
import React, { useEffect, useState } from "react";
import { medicalVQAService } from "../../services/medicalVQAService";
import ChatHistory from "./ChatHistory";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Header from "../Layout/Header.jsx";

function extractTotalSeconds(turn) {
    const candidates = [
        turn?.meta?.total_seconds,
        turn?.metadata?.total_seconds,
        turn?.meta_json?.total_seconds,
        turn?.image_meta?.total_seconds,
    ];

    const match = candidates.find((value) => Number.isFinite(Number(value)));
    return match === undefined ? null : Number(match);
}

function toUIMessagesFromSession(fullSession) {
    const turns = fullSession?.conversation_history || [];
    const ui = [];

    for (const t of turns) {
        if (t?.user) ui.push({
            role: "user",
            content: t.user,
            imagePath: t.image_path || null,
            examinationSeconds: extractTotalSeconds(t),
        });
        if (t?.assistant) ui.push({
            role: "assistant",
            content: t.assistant
        });
    }
    return ui;
}

export default function ChatInterface() {
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [memoryStatus, setMemoryStatus] = useState(null);
    const [summaryNotice, setSummaryNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingHasImage, setLoadingHasImage] = useState(false);
    const [error, setError] = useState("");
    const [responseKey, setResponseKey] = useState(null);
    const [loadingSeconds, setLoadingSeconds] = useState(0);

    const loadHistory = async () => {
        try {
            const data = await medicalVQAService.getChatHistory();
            setHistory(data?.chats || []);
        } catch (e) {
            console.error("getChatHistory error:", e);
        }
    };

    const loadMemoryStatus = async (sid) => {
        if (!sid) {
            setMemoryStatus(null);
            return;
        }

        try {
            const data = await medicalVQAService.getMemoryStatus(sid);
            setMemoryStatus(data);
        } catch (e) {
            console.error("getMemoryStatus error:", e);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        if (!loading) {
            setLoadingSeconds(0);
            return;
        }

        const startTime = Date.now();
        const intervalId = setInterval(() => {
            setLoadingSeconds(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [loading]);

    const handleSend = async ({ text, imageFile }) => {
        setError("");

        if (!text && !imageFile) {
            setError("Please enter a message or upload an image.");
            return;
        }

        const optimisticImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
        setLoadingHasImage(Boolean(imageFile));

        // optimistic user message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: text || "",
                localImageUrl: optimisticImageUrl,
            },
        ]);

        setLoading(true);
        try {
            let res;
            let nextSessionId = sessionId;
            if (!sessionId) {
                res = await medicalVQAService.startNewChat(text, imageFile);
                nextSessionId = res.session_id;
                setSessionId(nextSessionId);
            } else {
                res = await medicalVQAService.sendMessage(sessionId, text, imageFile);
                nextSessionId = res?.session_id || sessionId;
            }

            let latestSession = res?.full_session || null;

            // Refresh from persisted session so turn-level meta JSON like total_seconds is available.
            if (nextSessionId) {
                try {
                    latestSession = await medicalVQAService.getSession(nextSessionId);
                } catch (sessionErr) {
                    console.error("refresh session after send error:", sessionErr);
                }
            }

            if (latestSession?.conversation_history) {
                setMessages(toUIMessagesFromSession(latestSession));
            } else if (res?.full_session?.conversation_history) {
                setMessages(toUIMessagesFromSession(res.full_session));
            } else if (res?.response) {
                // fallback (only if backend doesn't return full_session)
                setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "(No response)" }]);
            }

            const nextMemoryStatus = res?.metadata?.memory || null;
            if (nextMemoryStatus) {
                setMemoryStatus(nextMemoryStatus);
            } else if (nextSessionId) {
                await loadMemoryStatus(nextSessionId);
            }

            if (nextMemoryStatus?.summary_updated) {
                const count = nextMemoryStatus.compression_count ?? 1;
                setSummaryNotice(`Earlier conversation was compressed to keep the chat responsive. Total compressions: ${count}.`);
            } else {
                setSummaryNotice("");
            }

            setResponseKey(Date.now());
            await loadHistory();
        } catch (err) {
            console.error("send error:", err);
            const detail = err?.response?.data?.detail;
            setError(detail || "Failed to send message.");

            // optional rollback optimistic user message:
        } finally {
            if (optimisticImageUrl) {
                URL.revokeObjectURL(optimisticImageUrl);
            }
            setLoading(false);
            setLoadingHasImage(false);
        }
    };


    const handleSelectSession = async (sid) => {
        setError("");
        setLoading(true);
        setResponseKey(null);
        try {
            const session = await medicalVQAService.getSession(sid);
            setSessionId(sid);
            setMessages(toUIMessagesFromSession(session));
            setSummaryNotice("");
            await loadMemoryStatus(sid);
        } catch (err) {
            console.error("load session error:", err);
            setError("Failed to load session.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (sid) => {
        try {
            await medicalVQAService.deleteSession(sid);
            if (sid === sessionId) {
                setSessionId(null);
                setMessages([]);
                setResponseKey(null);
                setMemoryStatus(null);
                setSummaryNotice("");
            }
            await loadHistory();
        } catch (err) {
            console.error("delete session error:", err);
        }
    };

    const handleNewChat = () => {
        setSessionId(null);
        setMessages([]);
        setError("");
        setResponseKey(null);
        setMemoryStatus(null);
        setSummaryNotice("");
    };

    return (
        <div className="h-screen bg-slate-100 text-gray-900 flex flex-col overflow-hidden">
            <Header
                leftSlot={
                    <div className="flex items-center justify-between">
                        {/* Right: sign out */}
                        <div className="w-72 flex-shrink-0 flex justify-start">
                            <button
                                onClick={handleNewChat}
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
                            >
                                New Chat
                            </button>
                        </div>

                    </div>
                }
            />

            <div className="flex flex-1 overflow-hidden">
                <ChatHistory
                    chats={history}
                    activeSessionId={sessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={handleNewChat}
                    onDeleteSession={handleDeleteSession}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {error && (
                        <div className="p-3 bg-red-500/10 border-b border-red-500 text-red-400 text-base">
                            {error}
                        </div>
                    )}

                    {summaryNotice && (
                        <div className="px-4 py-3 border-b border-amber-200 bg-amber-50 text-amber-800 text-sm">
                            {summaryNotice}
                        </div>
                    )}

                    {/* Only this div scrolls */}
                    <div className="flex-1 overflow-y-auto" data-scroll-container>
                        <MessageList
                            messages={messages}
                            responseKey={responseKey}
                            loading={loading}
                            loadingHasImage={loadingHasImage}
                            loadingSeconds={loadingSeconds}
                        />
                    </div>

                    <MessageInput
                        onSend={handleSend}
                        loading={loading}
                        loadingSeconds={loadingSeconds}
                        memoryStatus={memoryStatus}
                    />
                </div>
            </div>
        </div>
    );

}
