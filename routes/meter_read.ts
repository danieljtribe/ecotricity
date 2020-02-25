const express: any = require('express');
const meter_read_router: any  = express.Router();

import { validateMeterRead } from '../validators/meter_read';

export {};

/**
 * Presents stored meter readings for a given Customer ID.
 * @name GET/meter-read/customer
 * @param {string} customerId - Customer ID.
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 */
meter_read_router.get('/customer/:customerId', async function(req: any, res: any) {
    const customerId = req.params.customerId;

    await getMeterReadingByAttribute(req, res, 'customerId', customerId)
});

/**
 * Presents stored meter readings for a given meter Serial Number.
 * @name GET/meter-read/serialNumber
 * @param {string} serialNumber - Meter Serial Number.
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 */
meter_read_router.get('/meter/:serialNumber', async function(req: any, res: any) {
    const serialNumber = req.params.serialNumber;

    await getMeterReadingByAttribute(req, res, 'serialNumber', serialNumber)
});

/**
 * Accepts, validates and stores meter readings.
 * @name POST/meter-read
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 * @param {any} meterRead - Meter Read data.
 */
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

/**
 * Deletes stored meter readings.
 * @name DELETE/meter-read
 * @param {string} meterReadHash - Meter Read hash value.
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 */
meter_read_router.delete('/:meterReadHash', async function(req: any, res: any) {
    const meterReadHash = req.params.meterReadHash;

    await req.databasePool.query('DELETE FROM meter_read_details WHERE id = ?', [meterReadHash]);
    await req.databasePool.query('DELETE FROM meter_read_readings WHERE meter_read_details_id = ?', [meterReadHash]);

    res.status(200);
    res.json({});
});

/**
 * Retrieve all meter readings for a customer based upon a given attribute name and its value
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 * @param {string} attributeName - Schema attribute name to search upon
 * @param {string} attributeValue - Schema value to match upon
 */
async function getMeterReadingByAttribute(req: any, res: any, attributeName: string, attributeValue: string) {
    let read_details = await req.databasePool.query('SELECT * FROM meter_read_details WHERE ?? = ? ORDER BY readDate ASC', [attributeName, attributeValue]);

    if(read_details.length > 0) {
        for(let i = 0; i < read_details.length; i++) {
            let read = await req.databasePool.query('SELECT type, registerId, value FROM meter_read_readings WHERE meter_read_details_id = ?', [read_details[i].id]);
            delete read_details[i].id;

            read_details[i].read = read;
        }
        res.status(200);
        res.json({'value': read_details});
    } else {
        res.status(404);
        res.json({errors: 'Reading not found.'});
    }
}

export { meter_read_router };