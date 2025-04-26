import { useEffect, useState } from "react";

export function LoadingOverlay() {
  const [message, setMessage] = useState("Przygotowywanie żądania...");

  useEffect(() => {
    const messages = [
      "Przygotowywanie żądania...",
      "Generowanie treści...",
      "Już prawie gotowe...",
      "Finalizowanie...",
    ];
    let currentIndex = 0;

    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setMessage(messages[currentIndex]);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6"
      style={{ position: "absolute", maxWidth: "100%" }}
      data-test-id="loading-overlay"
    >
      <div className="flex items-center gap-2">
        <div className="flex space-x-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              style={{
                animation: "wave 1s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
      <p
        className="text-center text-sm text-muted-foreground animate-pulse"
        data-test-id="loading-message"
      >
        {message}
      </p>
    </div>
  );
}
