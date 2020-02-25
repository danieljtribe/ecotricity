'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.runSql('CREATE TABLE `meter_read_details` ( \
      `id` char(64) NOT NULL,\
      `customerId` varchar(32) NOT NULL,\
      `serialNumber` varchar(32) NOT NULL,\
      `mpxn` varchar(21) NOT NULL,\
      `readDate` varchar(32) NOT NULL,\
      PRIMARY KEY (`id`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;');

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};