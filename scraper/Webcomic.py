from abc import ABC, abstractmethod
import os
import logging
import psycopg2

logger = logging.getLogger()

db_url = os.environ['OPENSHIFT_POSTGRESQL_DB_URL']
debug = os.environ['NODE_ENV']
if db_url is None:
    db_url = 'postgresql://postgres:postgres@127.0.0.1:5432'

if debug:
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s: %(message)s')
    db_name = 'testing'
else:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s: %(message)s')
    db_name = 'dripfeed'


class Webcomic(ABC):
    def __init__(self):
        self.current_page = 0
        self.current_url = None
        self.webcomic_id = 0  # TODO

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
            logger.debug("No followup to page {}".format(self.current_page))
            self.current_page = 0
            self.current_url = None

    @abstractmethod
    def get_next_page_url(self):
        pass

    def add_current_page_to_db(self):
        with psycopg2.connect("{}/{}".format(db_url, db_name)) as connection:
            with connection.cursor() as cursor:
                sql = "INSERT INTO webcomics (page_nb, url, title, webcomic_id)" + \
                      "VALUES ((%s), (%s), (%s), (%s))"
                values = [self.current_page, self.current_url, "", self.webcomic_id]
                cursor.execute(sql, values)
