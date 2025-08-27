import express from "express";
import { register, login } from "../Controller/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
