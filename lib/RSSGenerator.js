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
    constructor(webcomicID, startDate, frequencyInSecs, startPage = 1) {
        this.webcomicInfoProvider = new WebcomicInfoProvider(webcomicID);
        this.startDate = startDate;
        this.frequencyInSecs = frequencyInSecs;
        this.startPage = startPage;
    }

    createFeed() {
        let requestedPageNb = this._getPageNbFromParameters();
        let frequencyInMins = Math.floor(this.frequencyInSecs / 60);
        return this._createFeedFormat(frequencyInMins)
        .then(feed => this._addItemsToFeed(feed, requestedPageNb))
    }

    _getPageNbFromParameters() {
        let timeIntervalInSecs = this._getSecondsSince();
        if (timeIntervalInSecs < 0) {
            winston.warn("RSSGenerator tried to generate a future startDate");
            throw new Error("Start date is in the future")
        }
        return Math.floor(timeIntervalInSecs / this.frequencyInSecs) + this.startPage;
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

    _addItemsToFeed(feed, requestedToPageNb) {
        // We go backwards because most RSS readers assume the most recent item is first
        const startDateInMs = this.startDate.getTime();

        return this.webcomicInfoProvider.getPageCount()
        .then(pageCount => {
            const toPageNb = Math.min(requestedToPageNb, pageCount);
            const fromPageNb = Math.max(toPageNb - NB_ITEMS_IN_FEED + 1, 1);

            return Promise.all([
                this.webcomicInfoProvider.getPageInfoRangeInverted(fromPageNb, toPageNb),
                toPageNb] // We return this to use it in the next promise
            );
        })
        .then(results => {
            let pageInfos = results[0];
            let pageNb = results[1];
            for (let pageInfo of pageInfos) {
                // (pageNb - 1) because page numbers start at 1 (page number 1 was sent immediately, at startDate)
                pageInfo.date = new Date(startDateInMs + (this.frequencyInSecs * 1000) * (pageNb - 1));
                feed.item(pageInfo);
                pageNb--;
            }
            return feed;
        });
    }
}

module.exports = RSSGenerator;
module.exports.NB_ITEMS_IN_FEED = NB_ITEMS_IN_FEED;
