var RSS = require('rss');

// How many items we put in a feed
// RSS feeds don't actually keep track of archive.
// So only showing the very last item should be enough,
// but we show a little of the past just in case an RSS client can't handle only 1
const NB_ITEMS_IN_FEED = 5;

function createFeed(startDate, frequency) {
    var lastItemId = getIdFromDateAndFrequency(startDate, frequency);
    var frequencyInMins = frequency / 60;
    var feed = createFeedFormat(frequencyInMins);
    addItemsToFeed(feed, lastItemId);
    return feed;
}

function getIdFromDateAndFrequency(startDate, frequencyInSecs) {
    var timeIntervalInSecs = getSecsSince(startDate);
    if (timeIntervalInSecs < 0) {
        throw new Error("Start date is in the future")
    }
    return timeIntervalInSecs / frequencyInSecs;
}

function getSecsSince(startDate) {
    var now = new Date();
    var msSince = now.getTime() - startDate.getTime();
    return msSince / 1000;
}

function createFeedFormat(ttl) {
    return new RSS({
        title: 'FooBar Webcomic',
        description: 'A fake feed',
        feed_url: 'http://example.com/rss.xml',
        docs: 'http://example.com/rss/docs.html',
        language: 'en',
        ttl: ttl
    });
}

function addItemsToFeed(feed, lastItemId, startDate, frequencyInSecs) {
    // We go backwards because most readers assume the most recent item is first
    for (var i = lastItemId; i < lastItemId - NB_ITEMS_IN_FEED || i < 0; i--) {
        var startDateInMs = startDate.getTime();
        var itemDate = new Date(startDateInMs + (frequencyInSecs * 1000));
        feed.item({
            title: 'Item number ' + i,
            description: 'description',
            url: 'http://xkcd.com/' + i,
            date: itemDate
        });
    }
}

module.exports.getIdFromDateAndFrequency = getIdFromDateAndFrequency;
module.exports.createFeed = createFeed;
