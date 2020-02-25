const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const meterReadSchema = Joi.object({
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
            Joi.object().keys({
                type: Joi.string().required(),
                registerId: Joi.number().required(),
                value: Joi.number().required()
            })
        ).required(),
    readDate: Joi.string().required()
    });

    async function validateMeterRead(reading: any) {
        try{
            const validation = await meterReadSchema.validate(reading, {abortEarly: false});
            if(validation.error) {
                const errors: any[] = [];
                validation.error.details.forEach((errorDetails: any) => { errors.push(errorDetails.message) });

                return({
                    success: false,
                    errors
                });
            } else {
                return({
                    success: true,
                    errors: []
                });
            }
        } catch(e) {
            return({
                success: false,
                errors: ['Internal Validator error']
            });
        }
    }

export { validateMeterRead }