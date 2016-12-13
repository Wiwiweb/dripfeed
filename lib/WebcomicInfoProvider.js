"use strict";

var db = require('./db');
var winston = require('winston');

class WebcomicInfoProvider {
    constructor(webcomicID) {
        this.webcomicID = webcomicID;
    }

    getWebcomicInfo() {
        return db("SELECT * FROM webcomics WHERE id=$1::int", [this.webcomicID])
        .then(function(result) {
            return {
                name: result.rows[0].name,
                description: result.rows[0].description,
                main_url: result.rows[0].main_url,
            }
        })
        .catch(err => winston.error(err.message));
    }

    getPageInfo(pageID) {
        return db("SELECT * FROM pages WHERE webcomic_id=$1::int AND page_nb=$2::int", [this.webcomicID, pageID])
        .then(function(result) {
            return {
                url: result.rows[0].url,
                title: result.rows[0].title,
            }
        })
        .catch(err => winston.error(err.message));
    }
}

module.exports = WebcomicInfoProvider;
