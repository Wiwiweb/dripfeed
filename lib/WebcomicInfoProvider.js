"use strict";

let db = require('./db');

class WebcomicInfoProvider {
    constructor(webcomicID) {
        this.webcomicID = webcomicID;
    }

    getWebcomicInfo() {
        return db("SELECT * FROM webcomics WHERE id=$1::int", [this.webcomicID])
        .then(result => {
            if (result.rows.length === 0) {
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

    getPageInfo(pageNb) {
        if (pageNb <= 0) {
            throw new Error("Tried to get invalid page: " + pageNb);
        }

        return db("SELECT * FROM pages WHERE webcomic_id=$1::int AND page_nb=$2::int", [this.webcomicID, pageNb])
        .then(result => {
            if (result.rows.length === 0) {
                throw new Error("Page id not found in db: " + pageNb);
            }
            return {
                url: result.rows[0].url,
                title: result.rows[0].title,
            }
        });
    }

    getPageInfoRangeInverted(fromPageNb, toPageNb) {
        if (fromPageNb > toPageNb || fromPageNb <= 0) {
            throw new Error("Tried to get invalid range: " + fromPageNb + "," + toPageNb);
        }

        let query = "SELECT * FROM pages " +
            "WHERE webcomic_id=$1::int AND page_nb BETWEEN $2::int AND $3::int " +
            "ORDER BY page_nb DESC";
        return db(query, [this.webcomicID, fromPageNb, toPageNb])
        .then(result => {
            if (result.rows.length === 0) {
                throw new Error("No pages found in db for this range: " + fromPageNb + "," + toPageNb);
            }
            let pageInfoResults = [];
            for (let row of result.rows) {
                let pageInfo = {
                    url: row.url,
                    title: row.title,
                };
                pageInfoResults.push(pageInfo);
            }
            return pageInfoResults
        });
    }
}

module.exports = WebcomicInfoProvider;
