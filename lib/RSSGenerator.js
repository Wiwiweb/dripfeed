var RSS = require('rss');

var PageInfoProvider = require('./WebcomicInfoProvider');

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
    var webcomicInfo = PageInfoProvider.getWebcomicInfo(0);
    webcomicInfo.ttl = ttl;
    return new RSS(webcomicInfo);
}

function addItemsToFeed(feed, lastItemId, startDate, frequencyInSecs) {
    // We go backwards because most RSS readers assume the most recent item is first
    for (var id = lastItemId; id < lastItemId - NB_ITEMS_IN_FEED || id < 0; i--) {
        var pageInfo = PageInfoProvider.getPageInfo(0, id);
        var startDateInMs = startDate.getTime();
        pageInfo.date = new Date(startDateInMs + (frequencyInSecs * 1000));
        feed.item(pageInfo);
    }
}

module.exports.getIdFromDateAndFrequency = getIdFromDateAndFrequency;
module.exports.createFeed = createFeed;
