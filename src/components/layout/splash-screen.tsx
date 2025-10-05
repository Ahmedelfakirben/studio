
'use client';

import { cn } from "@/lib/utils";
import React from "react";

export function SplashScreen({ finished }: { finished: boolean }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-sidebar-background transition-opacity duration-1000",
        finished ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
        <div className={cn(
            "flex flex-col items-center gap-4 transition-opacity duration-500",
            finished ? "opacity-0" : "opacity-100"
        )}>
             <div className="w-24 h-24 bg-accent rounded-2xl flex items-center justify-center shadow-2xl animate-fade-in-up">
                <span className="text-5xl font-bold text-accent-foreground">A</span>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-accent animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    A.L.Y Travaux Publique
                </h1>
            </div>
        </div>
    </div>
  );
}

const animation = `
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
`;

// Inject animation styles into the head
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animation;
    document.head.appendChild(styleSheet);
}
