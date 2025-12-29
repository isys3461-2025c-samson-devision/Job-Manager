import { useEffect, useState } from "react";
import { getMySubscription } from "../api/subscriptionApi";

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await getMySubscription();
      setSubscription(res);
    } catch (e) {
      console.error("Failed to fetch subscription", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    isPremium: subscription?.premium === true,
    status: subscription?.status,
    loading,
    refresh: fetchSubscription,
  };
}
