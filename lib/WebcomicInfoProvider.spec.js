var test = require('tape');
var winston = require('winston');

const before = test;

var db = require('./db');
var WebcomicInfoProvider = require('./WebcomicInfoProvider');

const SETUP_TEST_DATA_FILE = 'sql/setup_test_data.sql';

function setupBasicWebcomicInfoProvider(webcomicName = 'XKCD') {
    return db("SELECT id FROM webcomics WHERE name=$1::text", [webcomicName], 'testing')
    .then(result => new WebcomicInfoProvider(result.rows[0].id));
}

before('create db test data', function(t) {
    db.fromFile(SETUP_TEST_DATA_FILE)
    .then(() => t.end())
    .catch(err => winston.error(err.message))
});

test('getWebcomicInfo', function(t) {
    setupBasicWebcomicInfoProvider()
    .then(webcomicInfoProvider => webcomicInfoProvider.getWebcomicInfo())
    .then(results => {
        var expected = {
            name: 'XKCD',
            description: 'A webcomic of romance, sarcasm, math, and language.',
            main_url: 'http://xkcd.com',
        };
        t.deepEqual(results, expected);
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
    setupBasicWebcomicInfoProvider()
    .then(webcomicInfoProvider => webcomicInfoProvider.getPageInfo(1))
    .then(results => {
        var expected = {
            url: 'http://xkcd.com/2/',
            title: 'Petit Trees (sketch)',
        };
        t.deepEqual(results, expected);
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