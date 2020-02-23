const express = require('express');
const router = express.Router();

const validators = require('../validators/meter_read');

/* /meter-read */
router.get('/', async function(req: any, res: any) {

    res.status(200);
    res.json({'value':true});
});

/* /meter-read */
router.post('/', async function(req: any, res: any) {
    const meterRead = req.body;

    await validators.validateMeterRead(meterRead) ? res.status(200) : res.status(400);
    res.send('')
    //res.json({'value':true});
});

module.exports = router;