import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();

router.route("/register").post(UserController.register);

export default router;
