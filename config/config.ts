require("dotenv").config(); //instatiate environment variables

module.exports = {
  app: process.env.APP,
  port: process.env.PORT,
  db_dialect: process.env.DB_DIALECT,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_name: process.env.DB_NAME,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  jwt_secret: process.env.JWTSecret,
  identity_token_permanent_age: process.env.IdentityTokenPermanentAge,
  identity_token_temporary_age: process.env.IdentityTokenTemporaryAge,
};
