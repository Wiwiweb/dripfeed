var express = require('express');
var router = express.Router();

var RSSGenerator = require('../lib/RSSGenerator');

router.get('/', function(req, res, next) {
    var startDate = req.query.startDate;
    var frequency = req.query.frequency;
    if (startDate == null || frequency == null) {
        return res.status(400).send('Missing parameters').end();
    }

    startDate = new Date(startDate);
    frequency = parseInt(frequency);
    if (!isValidDate(startDate) || isNaN(frequency)) {
        return res.status(400).send('Invalid parameters').end();
    }

    var rssGenerator = new RSSGenerator(0, startDate, frequency);
    var feed = rssGenerator.createFeed();

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml({indent: true}));
});

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime())
}

module.exports = router;
