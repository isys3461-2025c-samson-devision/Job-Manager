import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
} from "../api/notificationApi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ fetch unread count ONCE
  const fetchUnreadCount = useCallback(async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, []);

  // ✅ fetch notifications ONLY when needed
  const fetchNotifications = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const data = await getMyNotifications(); // ✅ data is ARRAY
    setItems(data);

    setLoading(false);
  }, [loading]);

  const markAsRead = async (id) => {
    await markNotificationRead(id);

    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    const unread = items.filter((n) => !n.read);

    if (unread.length === 0) return;

    // mark all on backend
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));

    // update UI
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    setUnreadCount(0);
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        items,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
