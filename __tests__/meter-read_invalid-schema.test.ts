import request from 'supertest';
const app = require('../index')

export {};

describe('Test error handling', () => {

    it('should NOT accept a schema with a missing customerId', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with an invalid customerId', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "Robert'); DROP TABLE STUDENTS; --",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing serialNumber', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing mpxn', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing read', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing read.type', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });


    it('should NOT accept a schema with a missing read.registerId', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing read.value', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ],
                    "readDate": "2017-11-20T16:19:48+00:00Z"
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

    it('should NOT accept a schema with a missing readDate', (done) => {
        request(app).post('/meter-read')
            .send(
                {
                    "customerId": "identifier123",
                    "serialNumber": "27263927192",
                    "mpxn": "14582749",
                    "read": [
                        {"type": "ANYTIME", "registerId": "387373", "value": "2729"},
                        {"type": "NIGHT", "registerId": "387373", "value": "2892"}
                    ]
                }
            ).then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors).toBeDefined();
                done();
            });
    });

});
