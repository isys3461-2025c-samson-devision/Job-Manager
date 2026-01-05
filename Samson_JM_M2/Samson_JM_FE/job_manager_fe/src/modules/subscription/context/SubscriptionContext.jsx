import { createContext, useEffect, useState } from "react";
import { getMySubscription } from "../api/subscriptionApi";

export const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const res = await getMySubscription();
      console.log("SUB RESPONSE:", res.data); // 👈 ADD THIS
      setIsPremium(res.status === "ACTIVE");
    } catch (err) {
      console.error("SUB ERROR:", err); // 👈 ADD THIS
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 This is the missing piece
  useEffect(() => {
    fetchSubscription(); // runs on app load & refresh
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
