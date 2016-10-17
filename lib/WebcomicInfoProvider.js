"use strict";

class WebcomicInfoProvider {
    constructor(webcomicID) {
        this.webcomicID = webcomicID;
    }

    getWebcomicInfo() {
    // TODO get from db
    return {
        title: 'XKCD DripFeed',
        description: 'A fake feed. webcomicID: ' + this.webcomicID,
        feed_url: 'http://example.com/rss.xml',
        docs: 'http://example.com/rss/docs.html',
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
