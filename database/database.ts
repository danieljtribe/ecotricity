import mysql from 'promise-mysql';

async function createConnectionPool(): Promise<any> {
    const pool: any =
        await mysql.createPool({
            database: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOSTNAME,
            password: process.env.MYSQL_PASSWORD,
            user: process.env.MYSQL_USER
        });

    return pool;
}

export { createConnectionPool }