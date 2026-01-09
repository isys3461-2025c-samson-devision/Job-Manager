import { createContext, useEffect, useState } from "react";
import { getMySubscription } from "../api/subscriptionApi";
import { hasValidToken } from "../../../infrastructure/http/httpClient";

export const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const res = await getMySubscription();

      console.log("SUB RESPONSE:", res);

      // ✅ No subscription = FREE user
      if (!res) {
        setIsPremium(false);
        return;
      }

      setIsPremium(res.status === "ACTIVE");
    } catch (err) {
      console.warn("No subscription found");
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasValidToken()) {
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, []);

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
