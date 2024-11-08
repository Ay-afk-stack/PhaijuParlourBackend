import { Response } from "express";
import sendResponse from "./sendResponse";

const checkOTPExpiration = (res: Response, otpGeneratedTime: string) => {
  const currentTime = Date.now();
  const thresholdTime = 120000;
  if (currentTime - parseInt(otpGeneratedTime) <= thresholdTime) {
    sendResponse(
      res,
      200,
      true,
      "Your OTP is valid proceed to reset your password!"
    );
  } else {
    sendResponse(res, 403, false, "OTP expired already!");
  }
};

export default checkOTPExpiration;
