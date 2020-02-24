require("dotenv").config();

const bodyParser = require("body-parser");
const express    = require("express");
import { asyncMiddleware } from './middleware/asyncMiddleware';

const port = process.env.PORT || 3000;
const app = express();

export {};

app.use(bodyParser.json());
app.use(asyncMiddleware);

import { meter_read_router } from './routes/meter_read';
app.use("/meter-read", meter_read_router);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port);
    app.on("listening", () => console.info(`Meter Read API started on port: ${app.address().port}`));	
}

module.exports = app