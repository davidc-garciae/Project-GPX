import { useState, useEffect } from "react";

export interface NetworkStatus {
  isOnline: boolean;
  isReconnecting: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsReconnecting(true);
      setIsOnline(true);
      setTimeout(() => setIsReconnecting(false), 2000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, isReconnecting };
};
