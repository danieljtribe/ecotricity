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
  db.runSql('CREATE TABLE `meter_reads`.`meter_read_readings` (\
    `id` INT NOT NULL AUTO_INCREMENT,\
    `meter_read_details_id` char(64) NOT NULL,\
    `type` VARCHAR(7) NOT NULL,\
    `registerId` VARCHAR(16) NOT NULL,\
    `value` VARCHAR(8) NOT NULL,\
    PRIMARY KEY (`id`));');
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
