let test = require('tape');
let winston = require('winston');

let db = require('./db');
let WebcomicInfoProvider = require('./WebcomicInfoProvider');

function setupBasicWebcomicInfoProvider(webcomicName = 'XKCD') {
    return db("SELECT id FROM webcomics WHERE name=$1::text", [webcomicName], 'testing')
    .then(result => {
        if (result.rows.length != 1) {
            throw new Error("Wrong data returned for test");
        }
        return new WebcomicInfoProvider(result.rows[0].id);
    });
}

test('getWebcomicInfo', function(t) {
    setupBasicWebcomicInfoProvider()
    .then(webcomicInfoProvider => webcomicInfoProvider.getWebcomicInfo())
    .then(results => {
        let expected = {
            name: 'XKCD',
            description: 'A webcomic of romance, sarcasm, math, and language.',
            main_url: 'http://xkcd.com',
        };
        t.deepEqual(results, expected);
        t.end();
    })
    .catch(err => {
        t.error(winston.error(err));
        t.fail();
    });
});

test('getWebcomicInfo should reject if id is not found', function(t) {
    let webcomicInfoProvider = new WebcomicInfoProvider(9999);
    webcomicInfoProvider.getWebcomicInfo()
    .then(results => t.fail("getWebcomicInfo did not reject: " + results))
    .catch(err => {
        let expected = "Webcomic id not found in db: 9999";
        t.equals(err.message, expected);
        t.end();
    });
});

test('getPageInfo', function(t) {
    setupBasicWebcomicInfoProvider()
    .then(webcomicInfoProvider => webcomicInfoProvider.getPageInfo(1))
    .then(results => {
        let expected = {
            url: 'http://xkcd.com/2/',
            title: 'Petit Trees (sketch)',
        };
        t.deepEqual(results, expected);
        t.end();
    })
    .catch(err => {
        t.error(winston.error(err));
        t.fail();
    });
});

test('getPageInfo should reject if id is not found', function(t) {
    setupBasicWebcomicInfoProvider()
    .then(webcomicInfoProvider => webcomicInfoProvider.getPageInfo(9999))
    .then(results => t.fail("getWebcomicInfo did not reject: " + results))
    .catch(err => {
        let expected = "Page id not found in db: 9999";
        t.equals(err.message, expected);
        t.end();
    });
});
