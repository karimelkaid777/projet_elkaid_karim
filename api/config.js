require('dotenv').config();

module.exports = {
    ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || "EMMA123",
    BDD: {
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "user": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "bdname": process.env.DB_NAME
    }
}
