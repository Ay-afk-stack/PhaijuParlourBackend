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
          res.status(200).json({ success: true, message: "Login Successful!" });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserController;
