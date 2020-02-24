const request = require('supertest');
const app = require('../index')

export {};

const schema1 = {
    "customerId": "identifier123",
    "serialNumber": "27263927192",
    "mpxn": "14582749",
    "read": [
        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
    ],
    "readDate": "2017-11-20T16:19:48+00:00Z"
}

const schema2 = {
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

    it('should accept a valid schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                schema1
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

    it('should NOT accept a duplicate reading schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                schema1
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should accept a non-duplicate valid schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                schema2
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

    it('should recall a reading for a valid customerId', (done) => {
        request(app).get('/meter-read/customer/identifier123')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                expect(response.body).toEqual({"value": schema1})

                done();
            });
    });

    it('should recall a reading for a valid meter serialNumber', (done) => {
        request(app).get('/meter-read/meter/27263927192')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                expect(response.body).toEqual({"value": schema1})
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

            request(app).delete('/meter-read/78c78f06e4f1abae0e737c15afba877bea7485e76aec0a639e0c01c0963b925e')
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

});