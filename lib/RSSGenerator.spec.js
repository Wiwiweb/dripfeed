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
        return Promise.resolve(400);
    };

    getPageInfo(id) {
        return Promise.resolve({
            title: 'Fake number ' + id,
            url: "http://xkcd.com/" + id
        });
    };

    getPageInfoRangeInverted(fromID, toID) {
        let result = [];
        for (let i = toID; i >= fromID; i--) {
            let itemDateMs = new Date("Jan 1 2000").getTime() + 2 * HOURS * 1000 * i;
            result.push({
                title: 'Fake number ' + i,
                url: "http://xkcd.com/" + i,
                date: new Date(itemDateMs)
            })
        }
        return Promise.resolve(result);
    };
}

RSSGenerator.__set__("WebcomicInfoProvider", FakeWebcomicInfoProvider);

const HOURS = 60 * 60;

function setupBasicRSSGenerator() {
    let startDate = new Date("Jan 1 2000");
    let frequency = 2 * HOURS;
    return new RSSGenerator(1, startDate, frequency);
}

function createExpectedFeed(lastItemId, ttl, nbItems = RSSGenerator.NB_ITEMS_IN_FEED) {
    let rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: ttl
    };
    let expectedFeed = new RSS(rssInfo);
    for (let i = lastItemId; i > lastItemId - nbItems && i > 0; i--) {
        // (i - 1) because page numbers start at 1 (page number 1 was sent immediately, at startDate)
        let itemDateMs = new Date("Jan 1 2000").getTime() + 2 * HOURS * 1000 * (i - 1);
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
    // Since Feb 1 is exactly at the time of a new page, the page nb would change if this test takes longer than 1ms.
    // We add 1 second to avoid this pesky problem
    fakeNow = new Date(fakeNow.getTime() + 1000);
    fakeTime.travel(fakeNow);

    // There are 744 hours in 31 days, so 372 intervals of 2 hours + 1 starting page
    let lastPageNb = 373;
    let expectedFeed = createExpectedFeed(lastPageNb, 2 * 60);

    rssGenerator.createFeed().then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});

test('_getPageNbFromDateAndFrequency', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let fakeNow = new Date("Feb 1 2000");
    // Since Feb 1 is exactly at the time of a new page, the page nb would change if this test takes longer than 1ms.
    // We add 1 second to avoid this pesky problem
    fakeNow = new Date(fakeNow.getTime() + 1000);
    fakeTime.travel(fakeNow);

    let pageNb = rssGenerator._getPageNbFromDateAndFrequency();

    // There are 744 hours in 31 days, so 372 intervals of 2 hours + 1 starting page
    let expected = 373;

    t.equal(pageNb, expected);
    t.end();
});

test('_getPageNbFromDateAndFrequency future time should throw', function(t) {
    let startDate = new Date("Mar 1 2000");
    let frequency = 2 * HOURS;
    let rssGenerator = new RSSGenerator(1, startDate, frequency);
    let fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    t.throws(function() {
        rssGenerator._getPageNbFromDateAndFrequency();
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
    let requestedToPageNb = 84;
    let feed = new RSS(rssInfo);
    let expectedFeed = createExpectedFeed(requestedToPageNb, 42);
    rssGenerator._addItemsToFeed(feed, requestedToPageNb).then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});

test('_addItemsToFeed reached the end of pages', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: 42
    };
    let requestedPageNb = 415;
    let feed = new RSS(rssInfo);
    let expectedFeed = createExpectedFeed(400, 42); // 400 is the last page of this fake comic, see getPageCount at top
    rssGenerator._addItemsToFeed(feed, requestedPageNb).then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});

test('_addItemsToFeed not enough pages', function(t) {
    let rssGenerator = setupBasicRSSGenerator();
    let rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        ttl: 42
    };
    let requestedPageNb = 3;
    let feed = new RSS(rssInfo);
    let expectedFeed = createExpectedFeed(3, 42, 4);
    rssGenerator._addItemsToFeed(feed, requestedPageNb).then(feed => {
        t.equal(feed.xml(), expectedFeed.xml());
        t.end();
    });
});
