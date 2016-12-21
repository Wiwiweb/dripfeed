let express = require('express');
let router = express.Router();

let RSSGenerator = require('../lib/RSSGenerator');

router.get('/', function(req, res, next) {
    let webcomicId = req.query.webcomicId;
    let startDate = req.query.startDate;
    let frequency = req.query.frequency;
    if (webcomicId == null || startDate == null || frequency == null) {
        return res.status(400).send('Missing parameters').end();
    }

    startDate = new Date(startDate);
    webcomicId = parseInt(webcomicId);
    frequency = parseInt(frequency);
    if (!isValidDate(startDate) || isNaN(webcomicId) || isNaN(frequency)) {
        return res.status(400).send('Invalid parameters').end();
    }

    let rssGenerator = new RSSGenerator(webcomicId, startDate, frequency);
    rssGenerator.createFeed()
    .then(feed => {
        res.set('Content-Type', 'application/rss+xml');
        res.send(feed.xml({indent: true}));
    })
    .catch(err => {
        next(err);
    });
});

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime())
}

module.exports = router;
