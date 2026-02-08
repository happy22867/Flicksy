import React, { createContext, useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) return { notifications: [], addNotification: () => {}, clearNotifications: () => {} };
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const prevUserRef = useRef(user);

  useEffect(() => {
    if (prevUserRef.current && !user) {
      setNotifications([]);
    }
    prevUserRef.current = user;
  }, [user]);

  const addNotification = useCallback((item) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...item, id, read: false }]);
    return id;
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
