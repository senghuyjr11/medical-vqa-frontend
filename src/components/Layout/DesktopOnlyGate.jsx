import React, { useEffect, useState } from "react";

function detectMobile() {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent || navigator.vendor || "";
    const mobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const narrowViewport = window.matchMedia("(max-width: 900px)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    return mobileUa || (narrowViewport && coarsePointer);
}

export default function DesktopOnlyGate({ children }) {
    const [isMobile, setIsMobile] = useState(detectMobile);

    useEffect(() => {
        const update = () => setIsMobile(detectMobile());

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    if (isMobile) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h1 className="text-xl font-semibold text-slate-900">Desktop Only</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        This application is currently available on desktop and laptop devices only.
                        Please open it from a PC browser.
                    </p>
                </div>
            </div>
        );
    }

    return children;
}
