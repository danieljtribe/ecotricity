import express from 'express';
const meterReadRouter: any  = express.Router();

import { validateMeterRead } from '../validators/meter_read';

export {};

/**
 * Presents stored meter readings for a given Customer ID.
 * @name GET/meter-read/customer
 * @param {string} customerId - Customer ID.
 * @param {any} req - Express request object.
 * @param {any} res - Express response object.
 */
meterReadRouter.get('/customer/:customerId', async (req: any, res: any) => {
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
meterReadRouter.get('/meter/:serialNumber', async (req: any, res: any) => {
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
meterReadRouter.post('/', async (req: any, res: any) => {
    const meterRead: any = req.body;

    const validationResult = await validateMeterRead(meterRead)

    if(!validationResult.success) {
        res.status(400);
        res.json({errors: validationResult.errors});
    } else {
        const crypto = require('crypto');
        const meterReadId = [meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate].join(',');
        const meterReadHash = crypto.createHash('sha256').update(meterReadId).digest('hex');

        try {
            await req.databasePool.query('INSERT INTO meter_read_details (id, customerId, serialNumber, mpxn, readDate) VALUES (?, ?, ?, ?, ?)', [meterReadHash, meterRead.customerId, meterRead.serialNumber, meterRead.mpxn, meterRead.readDate]);

            for (const read of meterRead.read) {
                await req.databasePool.query('INSERT INTO meter_read_readings (meter_read_details_id, type, registerId, value) VALUES (?, ?, ?, ?)', [meterReadHash, read.type, read.registerId, read.value]);
            }

            res.status(200);
            res.json({});
        } catch(e) {
            if(e.code && e.code === 'ER_DUP_ENTRY') {
                res.status(400);
                res.json({errors: 'Reading with this ID already submitted.'});
            } else if(e.code) {
                res.status(500);
                res.json({errors: 'Internal server error.'});
            } else {
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
meterReadRouter.delete('/:meterReadHash', async (req: any, res: any) => {
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
    const readings = await req.databasePool.query('SELECT * FROM meter_read_details WHERE ?? = ? ORDER BY readDate ASC', [attributeName, attributeValue]);

    if(readings.length > 0) {
        for(const readDetails of readings) {
            const read = await req.databasePool.query('SELECT type, registerId, value FROM meter_read_readings WHERE meter_read_details_id = ?', [readDetails.id]);
            delete readDetails.id;

            readDetails.read = read;
        }
        res.status(200);
        res.json({'value': readings});
    } else {
        res.status(404);
        res.json({errors: 'Reading not found.'});
    }
}

export { meterReadRouter };