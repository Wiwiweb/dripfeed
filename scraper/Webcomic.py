from abc import ABC, abstractmethod
import logging
import db

logger = logging.getLogger()


class Webcomic(ABC):
    def __init__(self, name, scraper_id):
        self.name = name
        self.scraper_id = scraper_id
        self.webcomic_id = self.get_or_create_webcomic_id()
        self.current_page, self.current_url = self.get_last_page()

    def get_or_create_webcomic_id(self):
        sql = "SELECT id FROM webcomics WHERE scraper_id=(%s)"
        results = db.query(sql, [self.scraper_id])
        if len(results) >= 1:
            if len(results) > 1:
                logger.warning("Multiple webcomics with the scraper id " + self.name)
            return results[0][0]
        else:
            logger.info("Created webcomic " + self.name + " with scraper id " + self.scraper_id)
            sql = "INSERT INTO webcomics (name, scraper_id) VALUES (%s, %s) RETURNING id"
            results = db.query(sql, [self.name, self.scraper_id])
            return results[0][0]

    def get_last_page(self):
        sql = "SELECT page_nb, url FROM pages " \
              "WHERE webcomic_id=(%s)" \
              "ORDER BY page_nb DESC LIMIT 1"
        results = db.query(sql, [self.webcomic_id])
        if results:
            return results[0][0], results[0][1]
        else:
            return 0, None

    def get_and_process_next_page(self):
        self.get_next_page_and_update_state()
        if self.current_page > 0:
            self.add_current_page_to_db()

    def get_next_page_and_update_state(self):
        next_page_url = self.get_next_page_url()
        if next_page_url is not None:
            self.current_page += 1
            self.current_url = next_page_url
        else:
            logger.debug("No followup to {} page {}".format(self.name, self.current_page))
            self.current_page = 0
            self.current_url = None

    @abstractmethod
    def get_next_page_url(self):
        pass

    def add_current_page_to_db(self):
        sql = "INSERT INTO pages (page_nb, url, title, webcomic_id)" + \
              "VALUES ((%s), (%s), (%s), (%s))"
        values = [self.current_page, self.current_url, "", self.webcomic_id]
        db.query(sql, values)
        logger.info("Added {} page {}: {}".format(self.name, self.current_page, self.current_url))
