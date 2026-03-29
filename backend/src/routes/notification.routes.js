import express from "express";
import { getNotifications, readNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.put("/:userId/read", readNotifications);

export default router;
