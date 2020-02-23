const mysql = require("promise-mysql");

const asyncMiddleware = async (req: any, res: any, next: any) => {
    req.database = await mysql.createPool({
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOSTNAME,
        password: process.env.MYSQL_PASSWORD,
        user: process.env.MYSQL_USERNAME
    });
    next()
}

export { asyncMiddleware }