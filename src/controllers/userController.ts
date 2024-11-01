import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";

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
      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export default UserController;
