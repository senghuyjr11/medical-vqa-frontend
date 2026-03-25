// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import DesktopOnlyGate from "./components/Layout/DesktopOnlyGate";
import PrivateRoute from "./components/Layout/PrivateRoute";
import ChatInterface from "./components/Chat/ChatInterface";

function App() {
    return (
        <DesktopOnlyGate>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/chat"
                        element={
                            <PrivateRoute>
                                <ChatInterface />
                            </PrivateRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/chat" replace />} />
                    <Route path="*" element={<Navigate to="/chat" replace />} />
                </Routes>
            </BrowserRouter>
        </DesktopOnlyGate>
    );
}

export default App;
