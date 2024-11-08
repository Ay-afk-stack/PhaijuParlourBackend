import { Response } from "express";

const sendResponse = (
  res: Response,
  statusNumber: number,
  success: boolean,
  message: string,
  data: any = []
) => {
  res.status(statusNumber).json({
    success: success,
    message: message,
    data: data.length > 0 ? data : null,
  });
};

export default sendResponse;
