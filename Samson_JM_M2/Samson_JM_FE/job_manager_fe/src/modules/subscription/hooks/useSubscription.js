import { useEffect, useState } from "react";
import { getMySubscription } from "../api/subscriptionApi";

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPremium = () => {
    if (!subscription) {
      return false;
    }

    if (subscription.premium === true) {
      return true;
    }

    if (subscription.status !== "ACTIVE" || !subscription.endDate) {
      return false;
    }

    return new Date(subscription.endDate).getTime() > Date.now();
  };

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
    isPremium: isPremium(),
    status: subscription?.status,
    loading,
    refresh: fetchSubscription,
  };
}
