var readFile = require('fs-readfile-promise');
var test = require('tape');
var winston = require('winston');

const before = test;

var db = require('./db');
var WebcomicInfoProvider = require('./WebcomicInfoProvider');

const SETUP_TEST_DATA_FILE = '../sql/setup_test_data.sql';

function setupBasicWebcomicInfoProvider() {
    return db("SELECT id FROM webcomics WHERE name='XKCD'")
    .then(results => new WebcomicInfoProvider(results[0]));
}

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
    setupBasicWebcomicInfoProvider().then(function(webcomicInfoProvider) {
        var results = webcomicInfoProvider.getWebcomicInfo();
        var expected = {
            title: 'XKCD',
            description: 'A webcomic of romance, sarcasm, math, and language.',
            main_url: 'http://xkcd.com',
        };
        t.equal(results, expected);
        t.end();
    });
});

test('getWebcomicInfo should throw if id is not found', function(t) {
    var webcomicInfoProvider = new WebcomicInfoProvider(9999);
    t.throws(function() {
        webcomicInfoProvider.getWebcomicInfo();
    });
    t.end();
});

test('getPageInfo', function(t) {
    setupBasicWebcomicInfoProvider().then(function(webcomicInfoProvider) {
        var results = webcomicInfoProvider.getPageInfo(1);
        var expected = {
            url: 'http://xkcd.com/2/',
            title: 'Petit Trees (sketch)',
        };
        t.equal(results, expected);
        t.end();
    });
});

test('getPageInfo should throw if id is not found', function(t) {
    setupBasicWebcomicInfoProvider().then(function(webcomicInfoProvider) {
        t.throws(function() {
            webcomicInfoProvider.getPageInfo(9999);
        });
        t.end();
    });
});