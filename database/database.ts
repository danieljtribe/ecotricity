const mysql = require("promise-mysql");

async function getConnection() {
    let pool = 
        await mysql.createPool({
            database: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOSTNAME,
            password: process.env.MYSQL_PASSWORD,
            user: process.env.MYSQL_USER
        });

    return pool;
}

export { getConnection }