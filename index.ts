require("dotenv").config();

const bodyParser: any = require("body-parser");
const express: any    = require("express");

const port : string = process.env.PORT || '3000';
const app : any = express();

let databasePool: any;

import { getConnection } from './database/database';

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
    databasePool = await getConnection();
    req.databasePool = databasePool;
    next();
});

import { meter_read_router } from './routes/meter_read';
app.use("/meter-read", meter_read_router);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Meter Read API started on port ${port}`));
}

module.exports = app