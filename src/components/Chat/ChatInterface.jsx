// src/components/Chat/ChatInterface.jsx
import React, { useEffect, useState } from "react";
import { medicalVQAService } from "../../services/medicalVQAService";
import ChatHistory from "./ChatHistory";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Header from "../Layout/Header.jsx";

function toUIMessagesFromSession(fullSession) {
    const turns = fullSession?.conversation_history || [];
    const ui = [];

    for (const t of turns) {
        if (t?.user) ui.push({
            role: "user",
            content: t.user,
            imagePath: t.image_path || null  // ← add this
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadHistory = async () => {
        try {
            const data = await medicalVQAService.getChatHistory();
            setHistory(data?.chats || []);
        } catch (e) {
            console.error("getChatHistory error:", e);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleSend = async ({ text, imageFile }) => {
        setError("");

        if (!text && !imageFile) {
            setError("Please enter a message or upload an image.");
            return;
        }

        // optimistic user message
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text || "[Image uploaded]" },
        ]);

        setLoading(true);
        try {
            let res;
            if (!sessionId) {
                res = await medicalVQAService.startNewChat(text, imageFile);
                setSessionId(res.session_id);
            } else {
                res = await medicalVQAService.sendMessage(sessionId, text, imageFile);
            }

            // ✅ single source of truth: backend session
            if (res?.full_session?.conversation_history) {
                setMessages(toUIMessagesFromSession(res.full_session));
            } else if (res?.response) {
                // fallback (only if backend doesn't return full_session)
                setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "(No response)" }]);
            }

            await loadHistory();
        } catch (err) {
            console.error("send error:", err);
            const detail = err?.response?.data?.detail;
            setError(detail || "Failed to send message.");

            // optional rollback optimistic user message:
            // setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };


    const handleSelectSession = async (sid) => {
        setError("");
        setLoading(true);
        try {
            const session = await medicalVQAService.getSession(sid);
            setSessionId(sid);
            setMessages(toUIMessagesFromSession(session));
        } catch (err) {
            console.error("load session error:", err);
            setError("Failed to load session.");
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setSessionId(null);
        setMessages([]);
        setError("");
    };

    return (
        <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <ChatHistory
                    chats={history}
                    activeSessionId={sessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={handleNewChat}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {error && (
                        <div className="p-3 bg-red-500/10 border-b border-red-500 text-red-400 text-base">
                            {error}
                        </div>
                    )}

                    {/* Only this div scrolls */}
                    <div className="flex-1 overflow-y-auto">
                        <MessageList messages={messages} />
                    </div>

                    <MessageInput onSend={handleSend} loading={loading} />
                </div>
            </div>
        </div>
    );

}
