import app from "./src/app";
import envConfig from "./src/config/config";

const startServer = () => {
  const port = envConfig.port;
  app.listen(port, () => {
    console.log("Listening at http://localhost:" + port);
  });
};

startServer();
