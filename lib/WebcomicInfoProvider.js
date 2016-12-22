"use strict";

let db = require('./db');

class WebcomicInfoProvider {
    constructor(webcomicID) {
        this.webcomicID = webcomicID;
    }

    getWebcomicInfo() {
        return db("SELECT * FROM webcomics WHERE id=$1::int", [this.webcomicID])
        .then(result => {
            if (result.rows.length == 0) {
                throw new Error("Webcomic id not found in db: " + this.webcomicID);
            }
            return {
                title: result.rows[0].name,
                description: result.rows[0].description,
                main_url: result.rows[0].main_url,
            }
        });
    }

    getPageCount() {
        return db("SELECT count(*) FROM pages WHERE webcomic_id=$1::int", [this.webcomicID])
        .then(result => {
            return parseInt(result.rows[0].count);
        });
    }

    getPageInfo(pageID) {
        return db("SELECT * FROM pages WHERE webcomic_id=$1::int AND page_nb=$2::int", [this.webcomicID, pageID])
        .then(result => {
            if (result.rows.length == 0) {
                throw new Error("Page id not found in db: " + pageID);
            }
            return {
                url: result.rows[0].url,
                title: result.rows[0].title,
            }
        });
    }
}

module.exports = WebcomicInfoProvider;
