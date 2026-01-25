require('dotenv').config();

module.exports = {
    ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || "EMMA123",
    BDD: {
        "host": process.env.DB_HOST || "dpg-d4pamvu3jp1c7393mbf0-a.oregon-postgres.render.com",
        "port": process.env.DB_PORT || "5432",
        "user": process.env.DB_USER || "cnam_a1_web_pollution_v2_user",
        "password": process.env.DB_PASSWORD || "njzSaLl7CWFiQ5oYW7EvCpGJ5i3umijl",
        "bdname": process.env.DB_NAME || "cnam_a1_web_pollution_v2"
    }
}
