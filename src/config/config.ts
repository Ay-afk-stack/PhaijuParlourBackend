import { config } from "dotenv";

config();

const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
};

export default envConfig;
