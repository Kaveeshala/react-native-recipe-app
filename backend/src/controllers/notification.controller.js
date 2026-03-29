import {
  getNotificationsByOwner,
  markAllAsRead,
} from "../models/notification.model.js";

const getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await getNotificationsByOwner(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

const readNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    await markAllAsRead(userId);
    res.status(200).json({ message: "Marked all as read" });
  } catch (error) {
    console.error("Mark read error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { getNotifications, readNotifications };
