"use strict";

var db = require('./db');

class WebcomicInfoProvider {
    constructor(webcomicID) {
        this.webcomicID = webcomicID;
    }

    getWebcomicInfo() {
        db.query("FROM webcomics GET * WHERE id=$1::text", [this.webcomicId])
        .then();
        return {
            title: 'XKCD DripFeed',
            description: 'A fake feed. webcomicID: ' + this.webcomicID,
            feed_url: 'http://example.com/rss.xml',
            language: 'en'
        };
    }

    getPageInfo(id) {
        // TODO get from db
        return {
            title: 'XKCD number ' + id,
            description: 'Cool webcomic bro. webcomicID: ' + this.webcomicID,
            url: "http://xkcd.com/" + id
        };
    }
}

module.exports = WebcomicInfoProvider;
