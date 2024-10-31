import { Request, Response } from "express";
import User from "../database/models/userModel";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password, phoneNo, role } = req.body;

    if (!username || !email || !phoneNo || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields!" });
      return;
    }
    try {
      await User.create({ username, email, phoneNo, password, role });
      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export default UserController;
