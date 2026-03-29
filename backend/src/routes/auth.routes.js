import express from "express";
import { register, login, savePushToken } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/push-token", savePushToken);


export default router;
