require("dotenv").config();

const bodyParser = require("body-parser");
const express    = require("express");

const port = process.env.PORT || 3000;
const app = express();

let databasePool: any;

import { getConnection, closeConnection } from './database/database';

export {};

app.use(bodyParser.json());

app.use(async (req: any, res: any, next: any) => {
    databasePool = await getConnection();
    req.databasePool = databasePool;
    next();
});

import { meter_read_router } from './routes/meter_read';
app.use("/meter-read", meter_read_router);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port);
    app.on("listening", () => console.info(`Meter Read API started on port: ${app.address().port}`));
}

app.on("close", () => { console.log(`Meter Read API stopping`); closeConnection(databasePool) })

module.exports = app