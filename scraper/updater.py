import logging
from logging.handlers import RotatingFileHandler
import os
import sys

from webcomic_list import get_all_webcomics

LOG_FILE = '../logs/scraper.log'

debug = os.getenv('NODE_ENV') != 'production'
logger = logging.getLogger()

if debug:
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                        format='%(asctime)s: %(message)s')
else:
    rotating_handler = RotatingFileHandler(LOG_FILE, maxBytes=1024000, backupCount=1)
    rotating_handler.setFormatter(logging.Formatter('%(asctime)s: %(message)s'))
    rotating_handler.setLevel(logging.DEBUG)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(rotating_handler)


def update_all_webcomics():
    webcomic_list = get_all_webcomics()
    for webcomic in webcomic_list:
        while True:
            webcomic.get_and_process_next_page()
            if webcomic.current_page == 0:
                break


if __name__ == '__main__':
    update_all_webcomics()
