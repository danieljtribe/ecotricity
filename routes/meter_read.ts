const express = require('express');
const meter_read_router  = express.Router();

import { validateMeterRead } from '../validators/meter_read';
import { asyncMiddleware } from '../middleware/asyncMiddleware';

export {};

/* /meter-read */
meter_read_router.get('/', asyncMiddleware, async function(req: any, res: any) {
    //console.log(await req.database.query('SELECT * FROM table'));
    res.status(200);
    res.json({'value':true});
});

/* /meter-read */
meter_read_router.post('/', async function(req: any, res: any) {
    const meterRead = req.body;

    let validationResult = await validateMeterRead(meterRead)
    
    if(!validationResult.success) {
        res.status(400);
        res.json({errors: validationResult.errors});
    } else {
        res.status(200);
        res.json({});
    }
});

export { meter_read_router };