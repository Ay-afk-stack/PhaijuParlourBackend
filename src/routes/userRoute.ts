import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/forgotpassword").post(UserController.handleForgotPassword);
router.route("/verifyOtp").post(UserController.verifyOTP);
router.route("/resetpassword").post(UserController.resetPassword);

export default router;
