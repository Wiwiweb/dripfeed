let readFile = require('fs-readfile-promise');
let pg = require('pg');
let winston = require('winston');

const dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:5432';
const dbName = process.env.NODE_ENV === 'production' ? 'dripfeed' : 'testing';
const FIXTURES_FILE = 'sql/test_fixtures.sql';

function query(query, values) {
    return new Promise(function(resolve, reject) {
        let dbFullUrl = dbUrl + "/" + dbName;
        pg.connect(dbFullUrl, function(err, client, done) {
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
    });
}

function reloadFixtures() {
    return readFile(FIXTURES_FILE)
    .then(function(buffer) {
        var bufferString = buffer.toString();
        return query(bufferString);
    })
}

module.exports = query;
module.exports.reloadFixtures = reloadFixtures;
