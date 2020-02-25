import request from 'supertest';
const app = require('../index')

export {};

const customer1Schema1 = {
    "customerId": "identifier123",
    "serialNumber": "27263927192",
    "mpxn": "14582749",
    "read": [
        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
    ],
    "readDate": "2017-11-20T16:19:48+00:00Z"
}

const customer1Schema2 = {
    "customerId": "identifier123",
    "serialNumber": "27263927192",
    "mpxn": "14582749",
    "read": [
        {"type": "ANYTIME", "registerId": "387373", "value": "3224"},
        {"type": "NIGHT", "registerId": "387373", "value": "3294"}
    ],
    "readDate": "2017-12-20T18:24:32+00:00Z"
}

const customer2Schema1 = {
    "customerId": "identifier124",
    "serialNumber": "27263927195",
    "mpxn": "14582749",
    "read": [
        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
    ],
    "readDate": "2017-11-20T16:20:32+00:00Z"
}

describe('Test meter read functionality', () => {

    it('should accept a valid schema from customer 1 to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                customer1Schema1
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

    it('should NOT accept a duplicate reading from customer 1 schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                customer1Schema1
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should accept a follow-up reading from customer 1 with a valid schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                customer1Schema2
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

    it('should accept a valid schema from customer 2 to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                customer2Schema1
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

    it('should recall readings for a valid customerId', (done) => {
        request(app).get('/meter-read/customer/identifier123')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                expect(response.body.value[0]).toEqual(customer1Schema1)
                expect(response.body.value[1]).toEqual(customer1Schema2)

                done();
            });
    });

    it('should recall readings for a valid meter serialNumber', (done) => {
        request(app).get('/meter-read/meter/27263927192')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                expect(response.body.value[0]).toEqual(customer1Schema1)
                expect(response.body.value[1]).toEqual(customer1Schema2)
                done();
            });
    });

    it('should NOT recall a reading for an invalid customerId', (done) => {
        request(app).get('/meter-read/customer/thisIsntACustomer')
            .then((response: any) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT recall a reading for an imvalid meter serialNumber', (done) => {
        request(app).get('/meter-read/meter/thisIsntASerialNumber')
            .then((response: any) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should delete a reading via meter reading hash', (done) => {
        request(app).delete('/meter-read/c7fd031291bb126c3a9a019f349fece745b8eb3cd7813542bcfdd52f79aeff36')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
            
            request(app).delete('/meter-read/80de891f59ba6cf36392d4c8724b5c0950d819f9edaa6d8819f9a653b297e0c3')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });

            request(app).delete('/meter-read/78c78f06e4f1abae0e737c15afba877bea7485e76aec0a639e0c01c0963b925e')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

});