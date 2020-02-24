const express = require('express');
const meter_read_router  = express.Router();

import { validateMeterRead } from '../validators/meter_read';
import { getConnection } from '../database/database';

export {};

/* /meter-read */
meter_read_router.get('/customer/:customerId', async function(req: any, res: any) {
    const customerId = req.params.customerId;

    let read = await (await getConnection()).query('SELECT * FROM meter_read_details WHERE customerId = ?', [customerId]);

    if(read.length > 0) {
        res.status(200);
        res.json({'value': read});
    } else {
        res.status(404);
        res.json({errors: 'Reading not found.'});
    }
});

meter_read_router.get('/meter/:serialNumber', async function(req: any, res: any) {
    const serialNumber = req.params.serialNumber;

    let read = await (await getConnection()).query('SELECT * FROM meter_read_details WHERE serialNumber = ?', [serialNumber]);

    if(read.length > 0) {
        res.status(200);
        res.json({'value': read});
    } else {
        res.status(404);
        res.json({errors: 'Reading not found.'});
    }
});


/* /meter-read */
meter_read_router.post('/', async function(req: any, res: any) {
    const meterRead = req.body;

    let validationResult = await validateMeterRead(meterRead)
    
    if(!validationResult.success) {
        res.status(400);
        res.json({errors: validationResult.errors});
    } else {
        let crypto = require('crypto');
        let meterReadId = [meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate].join(',');
        let meterReadHash = crypto.createHash('sha256').update(meterReadId).digest('hex');

        try {
            await (await getConnection()).query('INSERT INTO meter_read_details (id, customerId, serialNumber, mpxn, readDate) VALUES (?, ?, ?, ?, ?)', [meterReadHash, meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate]);

            res.status(200);
            res.json({});
        } catch(e) {
            if(e.code && e.code === 'ER_DUP_ENTRY') {
                res.status(400);
                console.log(e);
                res.json({errors: 'Reading with this ID already submitted.'});
            } else {
                console.error(e);
                res.status(500);
                res.json({errors: 'Internal server error.'});
            }
        }
    }
});

/* /meter-read */
meter_read_router.delete('/:meterReadHash', async function(req: any, res: any) {
    const meterReadHash = req.params.meterReadHash;

    await (await getConnection()).query('DELETE FROM meter_read_details WHERE id = ?', [meterReadHash]);

    res.status(200);
    res.json({});
});

export { meter_read_router };