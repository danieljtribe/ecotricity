const express: any = require('express');
const meter_read_router: any  = express.Router();

import { validateMeterRead } from '../validators/meter_read';

export {};

/* /meter-read */
meter_read_router.get('/customer/:customerId', async function(req: any, res: any) {
    const customerId = req.params.customerId;

    await getMeterReadingByAttribute(req, res, 'customerId', customerId)
});

meter_read_router.get('/meter/:serialNumber', async function(req: any, res: any) {
    const serialNumber = req.params.serialNumber;

    await getMeterReadingByAttribute(req, res, 'serialNumber', serialNumber)
});

/* /meter-read */
meter_read_router.post('/', async function(req: any, res: any) {
    const meterRead: any = req.body;

    let validationResult = await validateMeterRead(meterRead)
    
    if(!validationResult.success) {
        res.status(400);
        res.json({errors: validationResult.errors});
    } else {
        let crypto = require('crypto');
        let meterReadId = [meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate].join(',');
        let meterReadHash = crypto.createHash('sha256').update(meterReadId).digest('hex');

        try {
            await req.databasePool.query('INSERT INTO meter_read_details (id, customerId, serialNumber, mpxn, readDate) VALUES (?, ?, ?, ?, ?)', [meterReadHash, meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate]);

            for(let i = 0; i < meterRead.read.length; i++) {
                await req.databasePool.query('INSERT INTO meter_read_readings (meter_read_details_id, type, registerId, value) VALUES (?, ?, ?, ?)', [meterReadHash, meterRead.read[i].type, meterRead.read[i].registerId, meterRead.read[i].value]);
            }

            res.status(200);
            res.json({});
        } catch(e) {
            if(e.code && e.code === 'ER_DUP_ENTRY') {
                res.status(400);
                res.json({errors: 'Reading with this ID already submitted.'});
            } else if(e.code) {
                console.error(e);
                res.status(500);
                res.json({errors: 'Internal server error.'});
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

    await req.databasePool.query('DELETE FROM meter_read_details WHERE id = ?', [meterReadHash]);
    await req.databasePool.query('DELETE FROM meter_read_readings WHERE meter_read_details_id = ?', [meterReadHash]);

    res.status(200);
    res.json({});
});

async function getMeterReadingByAttribute(req: any, res: any, attributeName: string, attributeValue: string) {
    let read_details = await req.databasePool.query('SELECT * FROM meter_read_details WHERE ?? = ?', [attributeName, attributeValue]);

    if(read_details.length > 0) {
        let read = await req.databasePool.query('SELECT type, registerId, value FROM meter_read_readings WHERE meter_read_details_id = ?', [read_details[0].id]);
        delete read_details[0].id;

        read_details[0].read = read;

        res.status(200);
        res.json({'value': read_details[0]});
    } else {
        res.status(404);
        res.json({errors: 'Reading not found.'});
    }
}

export { meter_read_router };