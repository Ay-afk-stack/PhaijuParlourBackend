import { Sequelize } from "sequelize-typescript";
import envConfig from "../config/config";

const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });

sequelize.sync({ force: false }).then(() => {
  console.log("Synced");
});

export default sequelize;
