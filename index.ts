require("dotenv").config();

const bodyParser = require("body-parser");
const express    = require("express");
import { asyncMiddleware } from './middleware/asyncMiddleware';

const port = process.env.PORT || 3000;
const app = express();

export {};

app.use(bodyParser.json());
app.use(asyncMiddleware);

const meter_read = require("./routes/meter_read");
app.use("/meter-read", meter_read);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port);
    app.on("listening", () => console.info(`Meter Read API on ${app.address().port}`));	
}

module.exports = app