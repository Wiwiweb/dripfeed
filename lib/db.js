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

function createDbIfNotExist() {
    checkDbExists().then(exists => {
        if (exists) {
            createDb();
        } else {
            winston.info("Found existing database");
        }
    });
}

function checkDbExists() {
    var checkDBquery = "SELECT 1 FROM pg_database WHERE datname = 'dripfeed'";
    return query(checkDBquery).then(result => result.rows.length == 0);
}

function createDb() {
    readFile(CREATE_DB_FILE)
    .then(buffer => buffer.toString())
    .then(query)
    .then(readFile(CREATE_TABLES_FILE))
    .then(buffer => buffer.toString())
    .then(query)
    .catch(err => winston.error(err.message))
}

module.exports = query;
module.exports.createDbIfNotExist = createDbIfNotExist;
module.exports.dbUrl = dbUrl;
