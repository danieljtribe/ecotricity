const request = require('supertest');
const app = require('../index')

export {};

describe('Test meter read functionality', () => {

    it('should respond to the GET method', (done) => {
        request(app).get('/meter-read').then((response: any) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    it('should accept a valid schema to the POST method', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.errors).not.toBeDefined();
                done();
            });
    });

});