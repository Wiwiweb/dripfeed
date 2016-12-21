let pg = require('pg');
let winston = require('winston');

const dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:5432';
const dbName = process.env.NODE_ENV === 'production' ? 'dripfeed' : 'testing';

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

module.exports = query;
