import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import { getMySubscription } from "../api/subscriptionApi";

export const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const res = await getMySubscription();
      setIsPremium(res?.status === "ACTIVE");
    } catch (err) {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchSubscription();
  }, [user]);

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
