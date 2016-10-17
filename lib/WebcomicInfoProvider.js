function getWebcomicInfo(webcomicID) {
    // TODO get from db
    return {
        title: 'XKCD DripFeed',
        description: 'A fake feed',
        feed_url: 'http://example.com/rss.xml',
        docs: 'http://example.com/rss/docs.html',
        language: 'en'
    };
}

function getPageInfo(webcomicID, id) {
    // TODO get from db
    return {
        title: 'XKCD number ' + id,
        description: 'Cool webcomic bro',
        url: "http://xkcd.com/" + id
    };
}

module.exports.getWebcomicInfo = getWebcomicInfo;
module.exports.getPageInfo = getPageInfo;
