import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";
import generateOTP from "../services/generateOTP";
import sendMail from "../services/sendMail";
import sendResponse from "../services/sendResponse";
import checkOTPExpiration from "../services/checkOTPExpiration";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password, phoneNo } = req.body;

    if (!username || !email || !phoneNo || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields!" });
      return;
    }
    try {
      await User.create({
        username,
        email,
        phoneNo,
        password: bcrypt.hashSync(password, 10),
      });

      await sendMail({
        to: email,
        subject: "Registration Successful!",
        html: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
  <div style='margin:50px auto;width:70%;padding:20px 0'>
    <div style='border-bottom:1px solid #eee'>
      <a style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>Phaiju Parlour</a>
    </div>
    <p style='font-size:1.1em'>Hi ${username},</p>
    <p>Thank you for choosing our parlour. Your account is registered successfully!</p>
    <p style='font-size:0.9em;'>Regards,<br />Phaiju Parlour</p>
    <hr style='border:none;border-top:1px solid #eee' />
    <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
      <p>Ayush Phaiju</p>
      <p>Faika,Kapan</p>
      <p>+977 9812312322</p>
    </div>
  </div>
</div>`,
      });

      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please enter credentials!",
      });
      return;
    }

    try {
      const [user] = await User.findAll({ where: { email: email } });

      if (!user) {
        res
          .status(404)
          .json({ success: false, messsage: "No user found with that email!" });
      } else {
        const isEqual = bcrypt.compareSync(password, user.password);
        if (!isEqual) {
          res
            .status(400)
            .json({ success: false, message: "Invalid Credentials" });
        } else {
          const token = generateToken(user.id as string, user.email as string);
          res
            .status(200)
            .json({ success: true, message: "Login Successful!", token });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Enter your email!" });
      return;
    }
    try {
      const [user] = await User.findAll({ where: { email: email } });
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "Email not registered!" });
      } else {
        const otp = generateOTP();

        user.otp = otp.toString();
        user.otpGeneratedTime = Date.now().toString();

        await user.save();
        await sendMail({
          to: email,
          subject: "Password Reset",
          html: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
  <div style='margin:50px auto;width:70%;padding:20px 0'>
    <div style='border-bottom:1px solid #eee'>
      <a style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>Phaiju Parlour</a>
    </div>
    <p style='font-size:1.1em'>Hi,</p>
    <p>Thank you for choosing our parlour. Use the following OTP to complete your reset your password. OTP is valid for 5 minutes.</p>
    <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 5px 15px;color: #fff;border-radius: 4px;'>${otp}</h2>
    <p style='font-size:0.9em;'>Regards,<br />Phaiju Parlour</p>
    <hr style='border:none;border-top:1px solid #eee' />
    <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
      <p>Ayush Phaiju</p>
      <p>Faika,Kapan</p>
      <p>+977 9812312322</p>
    </div>
  </div>
</div>`,
        });
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully!", otp });
      }
    } catch (err) {
      console.error(err);
      res.status(404).json({ success: false, message: "OTP not send" });
    }
  }
  static async verifyOTP(req: Request, res: Response) {
    const { otp, email } = req.body;
    if (!otp || !email) {
      sendResponse(res, 400, false, "Enter all the Fields!");
      return;
    }
    try {
      const [data] = await User.findAll({ where: { email, otp } });
      if (!data) {
        sendResponse(res, 404, false, "Email not registered!");
        return;
      }
      const otpGeneratedTime = data.otpGeneratedTime;
      checkOTPExpiration(res, otpGeneratedTime);
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, false, "Server Error");
    }
  }
  static async resetPassword(req: Request, res: Response) {
    const { newPassword, confirmPassword, otp, email } = req.body;
    if (!newPassword || !confirmPassword || !email) {
      sendResponse(res, 400, false, "Enter all the Fields!");
      return;
    }
    const [user] = await User.findAll({ where: { email } });
    if (!user) {
      sendResponse(res, 404, false, "Email not registered!");
      return;
    }
    if (newPassword !== confirmPassword) {
      sendResponse(res, 400, false, "Password not matched!");
      return;
    }
    user.password = bcrypt.hashSync(confirmPassword, 10);
    await user.save();
    sendMail({
      to: email,
      subject: "Password Changed",
      html: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
  <div style='margin:50px auto;width:70%;padding:20px 0'>
    <div style='border-bottom:1px solid #eee'>
      <a style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>Phaiju Parlour</a>
    </div>
    <p style='font-size:1.1em'>Hi ${user.username},</p>
    <p>Thank you for choosing our parlour. Your password is changed successfully!</p>
    <p style='font-size:0.9em;'>Regards,<br />Phaiju Parlour</p>
    <hr style='border:none;border-top:1px solid #eee' />
    <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
      <p>Ayush Phaiju</p>
      <p>Faika,Kapan</p>
      <p>+977 9812312322</p>
    </div>
  </div>
</div>`,
    });
    sendResponse(res, 200, true, "Password reset Successfully!");
  }
}

export default UserController;
