import bodyParser from 'body-parser';
import express from 'express';

require("dotenv").config();

const port : string = process.env.PORT || '3000';
const app : any = express();

import { createConnectionPool } from './database/database';

export {};

app.use(bodyParser.json());

/**
 * Opens a connection to the backend database and adds this pool connection
 *  to the Express request object.
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 * @param {any} next - Next Express middleware.
 */
app.use(async (req: any, res: any, next: any) => {
    try {
        let databasePool = await createConnectionPool();
        req.databasePool = databasePool;
        await req.databasePool.getConnection();
        next();
    } catch(e) {
        if(e.code === 'ENOTFOUND') {
            res.status(500);
            res.send({error: `Unable to establish connection to database.`});
        } else {
            res.status(500);
            res.send({error: `Error establishing connection to database: ${e.code}`});
        }
    }
});

import { meterReadRouter } from './routes/meter_read';
app.use("/meter-read", meterReadRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.info(`Meter Read API started on port ${port}`));
}

module.exports = app