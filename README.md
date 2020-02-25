A service to accept and present meter reads
======================================

Thank you for inviting me to take this test, I hope this meets the requirements of the challenge! 

This service accepts, and presents, meter readings sent to it via a REST API. These routes are:
* GET `/meter-read/customer/{customerId}`
* GET `/meter-read/meter/{meterSerialNumber}`
* POST `/meter-read`

#### Validation 
Accepted meter readings are validated against the provided schema (see: 'validators/meter_read.ts'). Validation errors are responded-to with an HTTP 400 error with an associated JSON response containing details of the error, for example:  `{ errors: [ '"serialNumber" is required' ] }`

Meter readings are also verified to ensure they are not duplicates of previously stored readings, though follow-up readings are allowed. Uniqueness is achieved by hashing customerId, serialNumber, mpxn and readDate to achieve a unique ID for the meter read. These values were chosen to allow meter readings to be uniquely associated with the customer, meter, supply type (electric/gas) and the supplied date/time.

#### Testing
Tests have been added to this project to ensure the continued correct functioning of the service; the descriptions of the tests, written in Jasmine and run on the Jest/Supertest framework, are available in the '__tests__' directory. These tests check to ensure validation errors are presented for all invalid schemas presented to the service, that duplicate meter reads are rejected and that the service is capable of correctly accepting and presenting meter reads as-described in the project brief. 

#### Storage
Meter reads are stored in a MySQL database, but is also compatible with AWS Aurora. A non-schemaless, relational, database was chosen over a schemaless database due the meter read schema being fixed. Meter reading details and meter reading values are split and stored in two separate database tables, meter_read_details and meter_read_readings, these are linked by meter_read_details.id allowing many reading values (per meter 'type') per customer, meter, supply type and data/time - allowing, for example, the system to accept and store two readings (day/night) for a single customer's meter where the meter is an Economy 7/Economy 10 meter.

During project start, test and test:watch, database schema are checked to ensure the correct version is deployed prior to starting the service, via database migration files held in 'migrations/'.

#### Presentation
Stored meter readings can be recalled via the  `/meter-read/customer/{customerId}` and  `/meter-read/meter/{meterSerialNumber}` routes, where multiple meter readings have been provided by the customer, or for the meter, these are returned in a date-ordered array of meter read schemas. 

## Setting, testing and running up the service

### Set up

The service requires an environment file, containing the backend database hostname, username and password; for example:

```
MYSQL_DATABASE=meter_reads
MYSQL_HOSTNAME=database

MYSQL_USER=username
MYSQL_PASSWORD=password

MYSQL_ROOT_PASSWORD=password
```

A docker-compose.yaml file is included with the project for local testing. This will build and create the correct schema, then run integration tests against the service code.

### Running tests

```
npm test
```

### Compiling and running the service

```
npm start
```
