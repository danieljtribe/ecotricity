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

    let validationResult = await validators.validateMeterRead(meterRead)
    
    if(!validationResult.success) {
        res.status(400);
        res.json({errors: validationResult.errors});
    } else {
        res.status(200);
        res.json({});
    }
});

module.exports = router;