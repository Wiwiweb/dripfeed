"use strict";

let test = require('tape');
let rewire = require('rewire');
let fakeTime = require('timekeeper');
let winston = require('winston');

let RSS = require('rss');

let RSSGenerator = rewire('./RSSGenerator');

class FakeWebcomicInfoProvider {
    getWebcomicInfo() {
        return Promise.resolve({
            title: 'Fake DripFeed',
            description: 'A fake feed.',
        });
    };

    getPageCount() {
        return Promise.resolve(12);
    };

    getPageInfo(id) {
        return Promise.resolve({
            title: 'Fake number ' + id,
            url: "http://xkcd.com/" + id
        });
    };
}

RSSGenerator.__set__("WebcomicInfoProvider", FakeWebcomicInfoProvider);

const HOURS = 60 * 60;

function setupBasicRSSGenerator() {
    let startDate = new Date("Jan 1 2000");
    let frequency = 2 * HOURS;
    return new RSSGenerator(1, startDate, frequency);
}

function createExpectedFeed(lastItemId, ttl) {
    let rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: ttl
    };
    let expectedFeed = new RSS(rssInfo);
    for (let i = lastItemId; i > lastItemId - RSSGenerator.NB_ITEMS_IN_FEED; i--) {
        let itemDateMs = new Date("Jan 1 2000").getTime() + 2 * HOURS * 1000 * i;
        expectedFeed.item({
            title: 'Fake number ' + i,
            url: "http://xkcd.com/" + i,
            date: new Date(itemDateMs)
        });
    }
    return expectedFeed;
}

test('createFeed', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    // There are 744 hours in 31 days, so 372 intervals of 2 hours
    let lastItemId = 372;
    let expectedFeed = createExpectedFeed(lastItemId, 2 * 60);

    rssGenerator.createFeed().then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});

test('_getIdFromDateAndFrequency', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    let id = rssGenerator._getIdFromDateAndFrequency();

    // There are 744 hours in 31 days, so 372 intervals of 2 hours
    let expected = 372;

    t.equal(id, expected);
    t.end();
});

test('_getIdFromDateAndFrequency future time should throw', function(t) {
    let startDate = new Date("Mar 1 2000");
    let frequency = 2 * HOURS;
    let rssGenerator = new RSSGenerator(1, startDate, frequency);
    let fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    t.throws(function() {
        rssGenerator._getIdFromDateAndFrequency();
    });
    t.end();
});

test('_getSecondsSince', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    let secondsSince = rssGenerator._getSecondsSince();

    // There are 744 hours in 31 days
    let expected = 744 * HOURS;

    t.equal(secondsSince, expected);
    t.end();
});

test('_createFeedFormat', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let expected = new RSS({
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: 42
    });
    rssGenerator._createFeedFormat(42).then(result => {
        t.equal(result.xml(), expected.xml());
        t.end();
    });
});

test('_addItemsToFeed', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: 42
    };
    let lastItemId = 84;
    let feed = new RSS(rssInfo);
    let expectedFeed = createExpectedFeed(lastItemId, 42);
    rssGenerator._addItemsToFeed(feed, lastItemId).then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});
