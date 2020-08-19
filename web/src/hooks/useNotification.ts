import { useEffect, useCallback, useRef } from "react";

export const useNotification = () => {
  const notificationRef = useRef<Notification>();
  const sendNotification = useCallback((mesg: string) => {
    if (Notification.permission === "granted") {
      if (notificationRef.current) {
        notificationRef.current.close();
      }
      notificationRef.current = new Notification(mesg);
    }
  }, []);
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  return sendNotification;
};
