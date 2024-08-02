import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });
const config = {
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "my_secret_key",
    accessTokenExpiryMS: "300000000s",
    refreshTokenExpiryMS: "36000000s",
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
export default config;
