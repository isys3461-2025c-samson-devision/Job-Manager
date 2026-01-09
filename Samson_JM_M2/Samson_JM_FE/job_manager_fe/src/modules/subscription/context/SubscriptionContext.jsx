import { createContext, useEffect, useState, useCallback } from "react";
import { getMySubscription } from "../api/subscriptionApi";

export const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMySubscription();

      // ✅ res can be null (204) or not what you expect
      const status = res?.status; // safe
      setIsPremium(status === "ACTIVE");
  } catch (err) {
    if (err?.status === 401) {
      setIsPremium(false); // ✅ normal case
    } else {
      console.error("SUB ERROR:", err);
      setIsPremium(false);
    }
  } finally {
    setLoading(false);
  }

  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        loading,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
