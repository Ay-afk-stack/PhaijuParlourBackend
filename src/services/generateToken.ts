import jwt from "jsonwebtoken";
import envConfig from "../config/config";

const generateToken = (userId: string, userEmail: string) => {
  const token = jwt.sign(
    { userId: userId, userEmail: userEmail },
    envConfig.jwtSecretKey as string,
    { expiresIn: envConfig.jwtExpiresIn }
  );
  return token;
};

export default generateToken;
