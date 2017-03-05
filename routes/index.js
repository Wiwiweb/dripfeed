let express = require('express');
let router = express.Router();

let db = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    getAllWebcomics()
    .then(webcomics =>
        res.render('index', {
            webcomics: webcomics,
            timeNow: getCurrentDate()
        }));

});


function getAllWebcomics() {
    return db("SELECT * FROM webcomics")
    .then(result => result.rows)
}

function getCurrentDate() {
    let date = new Date();
    return date.toISOString().split('.')[0]+"Z";

}

module.exports = router;
