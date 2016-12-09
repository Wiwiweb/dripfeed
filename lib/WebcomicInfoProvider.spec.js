var readFile = require('fs-readfile-promise');
var test = require('tape');
var winston = require('winston');

const before = test;

var db = require('./db');

const SETUP_TEST_DATA_FILE = '../sql/setup_test_data.sql';

before('create db test data', function(t) {
    readFile(SETUP_TEST_DATA_FILE)
    .then(function(buffer) {
        var bufferString = buffer.toString();
        return db(bufferString, [], 'testing');
    })
    .then(t.end())
    .catch(err => winston.error(err.message))
});

test('getWebcomicInfo', function(t) {

});

test('getWebcomicInfo should throw if id is not found', function(t) {

});

test('getPageInfo', function(t) {

});

test('getPageInfo should throw if id is not found', function(t) {

});