import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/forgotpassword").post(UserController.handleForgotPassword);

export default router;
