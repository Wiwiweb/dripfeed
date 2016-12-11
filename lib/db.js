var readFile = require('fs-readfile-promise');
var pg = require('pg');
var winston = require('winston');

var dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:5432';

function query(query, values, dbName = 'dripfeed') {
    return new Promise(function(resolve, reject) {
        var dbFullUrl = dbUrl + "/" + dbName;
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

function queryFromFile(file, values, dbName = 'dripfeed') {
    readFile(file)
    .then(function(buffer) {
        var bufferString = buffer.toString();
        return query(bufferString, values, dbName);
    })
}

module.exports = query;
module.exports.fromFile = queryFromFile;
module.exports.dbUrl = dbUrl;
