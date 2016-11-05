var readFile = require('fs-readfile-promise');
var pg = require('pg');
var winston = require('winston');

const CREATE_DB_FILE = 'lib/create_database.sql';
const CREATE_TABLES_FILE = 'lib/create_tables.sql';

var dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/dripfeed';

function query(query, values) {
    return new Promise(queryPromise);

    function queryPromise(resolve, reject) {
        pg.connect(dbUrl, function(err, client, done) {
            if (err) {
                reject(winston.error("Error fetching client from pool:", err));
            }
            client.query(query, values, function(err, result) {
                done();
                if (err) {
                    reject(winston.error("Error executing query:", err, query, values));
                }
                resolve(result);
            })
        });
    }
}

module.exports = query;
module.exports.dbUrl = dbUrl;
