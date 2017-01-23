"use strict";

let RSS = require('rss');
let winston = require('winston');

let WebcomicInfoProvider = require('./WebcomicInfoProvider');

// How many items we put in a feed
// RSS feeds don't actually keep track of archive.
// So only showing the very last item should be enough,
// but we show a little of the past just in case an RSS client can't handle only 1
const NB_ITEMS_IN_FEED = 5;

class RSSGenerator {
    constructor(webcomicID, startDate, frequencyInSecs) {
        this.webcomicInfoProvider = new WebcomicInfoProvider(webcomicID);
        this.startDate = startDate;
        this.frequencyInSecs = frequencyInSecs;
    }

    createFeed() {
        let requestedItemId = this._getIdFromDateAndFrequency();
        let frequencyInMins = Math.floor(this.frequencyInSecs / 60);
        return this._createFeedFormat(frequencyInMins)
        .then(feed => this._addItemsToFeed(feed, requestedItemId))
    }

    _getIdFromDateAndFrequency() {
        let timeIntervalInSecs = this._getSecondsSince();
        if (timeIntervalInSecs < 0) {
            winston.warn("RSSGenerator tried to generate a future startDate");
            throw new Error("Start date is in the future")
        }
        return Math.floor(timeIntervalInSecs / this.frequencyInSecs);
    }

    _getSecondsSince() {
        let now = new Date();
        let msSince = now.getTime() - this.startDate.getTime();
        return msSince / 1000;
    }

    _createFeedFormat(ttl) {
        return this.webcomicInfoProvider.getWebcomicInfo()
        .then(webcomicInfo => {
            webcomicInfo.ttl = ttl;
            return new RSS(webcomicInfo);
        });
    }

    _addItemsToFeed(feed, requestedItemId) {
        // We go backwards because most RSS readers assume the most recent item is first
        const startDateInMs = this.startDate.getTime();

        return this.webcomicInfoProvider.getPageCount()
        .then(pageCount => {
            const maximumPageId = Math.min(requestedItemId, pageCount - 1);
            const minimumPageId = Math.max(maximumPageId - NB_ITEMS_IN_FEED + 1, 0);

            return Promise.all([
                this.webcomicInfoProvider.getPageInfoRangeInverted(minimumPageId, maximumPageId),
                maximumPageId]
            );
        })
        .then(results => {
            let pageInfos = results[0];
            let pageNb = results[1];
            for (let pageInfo of pageInfos) {
                pageInfo.date = new Date(startDateInMs + (this.frequencyInSecs * 1000) * pageNb);
                feed.item(pageInfo);
                pageNb--;
            }
            return feed;
        });
    }
}

module.exports = RSSGenerator;
module.exports.NB_ITEMS_IN_FEED = NB_ITEMS_IN_FEED;
