const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const meter_readSchema = Joi.object({
    customerId: Joi.string()
        .alphanum()
        .required(),
    serialNumber: Joi.string()
        .alphanum()
        .required(),
    mpxn: Joi.string()
        .alphanum()
        .required(),
    read: Joi.array().items(
            Joi.object({
                type: Joi.string().required(),
                registerId: Joi.number().required(),
                value: Joi.number().required()
            })
        ).required(),
    readDate: Joi.string().required()
    });

module.exports = {
    async validateMeterRead(reading: any) {
        try{
            let validation = await meter_readSchema.validate(reading);
            if(validation.error) {
                //console.error(validation.error)
                return(false);
            } else {
                return(true);
            }
        } catch(e) {
            //console.error(e);
            return(false);
        }
    }
}