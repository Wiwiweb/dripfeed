"use strict";

var test = require('tape');
var rewire = require('rewire');
var fakeTime = require('timekeeper');

var RSS = require('rss');

var RSSGenerator = rewire('./RSSGenerator');

class FakeWebcomicInfoProvider {
    getWebcomicInfo() {
        return {
            title: 'Fake DripFeed',
            description: 'A fake feed.',
            feed_url: 'http://example.com/rss.xml',
            docs: 'http://example.com/rss/docs.html',
            language: 'en'
        };
    };

    getPageInfo(id) {
        return {
            title: 'Fake number ' + id,
            description: 'Cool webcomic bro.',
            url: "http://xkcd.com/" + id
        };
    };
}

RSSGenerator.__set__("WebcomicInfoProvider", FakeWebcomicInfoProvider);

const HOURS = 60 * 60;

function setupBasicRSSGenerator() {
    var startDate = new Date("Jan 1 2000");
    var frequency = 2 * HOURS;
    return new RSSGenerator(1, startDate, frequency);
}

test('_getIdFromDateAndFrequency normal test', function(t) {
    t.plan(1);

    var rssGenerator = setupBasicRSSGenerator();
    var fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    var id = rssGenerator._getIdFromDateAndFrequency();

    // There are 744 hours in 31 days, so 372 intervals of 2 hours
    var expected = 372;

    t.equal(id, expected);
});

test('_getIdFromDateAndFrequency future time should throw', function(t) {
    t.plan(1);

    var startDate = new Date("Mar 1 2000");
    var frequency = 2 * HOURS;
    var rssGenerator = new RSSGenerator(1, startDate, frequency);
    var fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    t.throws(function() {
        rssGenerator._getIdFromDateAndFrequency();
    })
});

test('_getSecondsSince', function(t) {
    t.plan(1);

    var rssGenerator = setupBasicRSSGenerator();
    var fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    var secondsSince = rssGenerator._getSecondsSince();

    // There are 744 hours in 31 days
    var expected = 744 * HOURS;

    t.equal(secondsSince, expected);
});

test('_createFeedFormat', function(t) {
    t.plan(1);

    var rssGenerator = setupBasicRSSGenerator();
    var expected = new RSS({
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        feed_url: 'http://example.com/rss.xml',
        docs: 'http://example.com/rss/docs.html',
        language: 'en',
        ttl: 42
    });
    var result = rssGenerator._createFeedFormat(42);

    t.equal(result.xml(), expected.xml());
});

test('_addItemsToFeed ', function(t) {
    t.plan(1);

    var rssGenerator = setupBasicRSSGenerator();
    var rssInfo = {
        title: 'Fake DripFeed',
        description: 'A fake feed.',
        feed_url: 'http://example.com/rss.xml',
        docs: 'http://example.com/rss/docs.html',
        language: 'en',
        ttl: 42
    };
    var feed = new RSS(rssInfo);
    var expectedFeed = new RSS(rssInfo);
    var lastItemId = 42;
    for (var i = lastItemId; i > lastItemId - RSSGenerator.NB_ITEMS_IN_FEED; i--) {
        var itemDateMs = new Date("Jan 1 2000").getTime() + 2 * HOURS * 1000;
        expectedFeed.item({
            title: 'Fake number ' + i,
            description: 'Cool webcomic bro.',
            url: "http://xkcd.com/" + i,
            date: new Date(itemDateMs)
        });
    }
    rssGenerator._addItemsToFeed(feed, lastItemId);

    t.equal(feed.xml(), expectedFeed.xml());
});
