"use strict";

var RSS = require('rss');
var winston = require('winston');

var WebcomicInfoProvider = require('./WebcomicInfoProvider');

// How many items we put in a feed
// RSS feeds don't actually keep track of archive.
// So only showing the very last item should be enough,
// but we show a little of the past just in case an RSS client can't handle only 1
const NB_ITEMS_IN_FEED = 5;

class RSSGenerator {
    constructor(webcomicID, startDate, frequencyInSecs) {
        this.webcomicInfo = new WebcomicInfoProvider(webcomicID);
        this.startDate = startDate;
        this.frequencyInSecs = frequencyInSecs;
    }

    createFeed() {
        var lastItemId = this._getIdFromDateAndFrequency();
        var frequencyInMins = Math.floor(this.frequencyInSecs / 60);
        var feed = this._createFeedFormat(frequencyInMins);
        this._addItemsToFeed(feed, lastItemId);
        return feed;
    }

    _getIdFromDateAndFrequency() {
        var timeIntervalInSecs = this._getSecondsSince();
        if (timeIntervalInSecs < 0) {
            winston.warn("RSSGenerator tried to generate a future startDate");
            throw new Error("Start date is in the future")
        }
        return Math.floor(timeIntervalInSecs / this.frequencyInSecs);
    }

    _getSecondsSince() {
        var now = new Date();
        var msSince = now.getTime() - this.startDate.getTime();
        return msSince / 1000;
    }

    _createFeedFormat(ttl) {
        var webcomicInfo = this.webcomicInfo.getWebcomicInfo();
        webcomicInfo.ttl = ttl;
        return new RSS(webcomicInfo);
    }

    _addItemsToFeed(feed, lastItemId) {
        // We go backwards because most RSS readers assume the most recent item is first
        for (var id = lastItemId; id > lastItemId - NB_ITEMS_IN_FEED && id > 0; id--) {
            var pageInfo = this.webcomicInfo.getPageInfo(id);
            var startDateInMs = this.startDate.getTime();
            pageInfo.date = new Date(startDateInMs + (this.frequencyInSecs * 1000));
            feed.item(pageInfo);
        }
    }
}

module.exports = RSSGenerator;
module.exports.NB_ITEMS_IN_FEED = NB_ITEMS_IN_FEED;
