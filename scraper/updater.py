import logging
from logging.handlers import RotatingFileHandler
import os
import sys

from webcomic_list import get_all_webcomics

WEBCOMIC_LIST_FILE = 'webcomics.yaml'

log_dir = os.getenv('OPENSHIFT_LOG_DIR')
if log_dir is None:
    log_dir = '../logs/'
log_file = log_dir + 'scraper.log'


debug = os.getenv('NODE_ENV') != 'production'
logger = logging.getLogger()

# Silence python-requests
requests_log = logging.getLogger('requests')
requests_log.setLevel(logging.WARN)

if debug:
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                        format='%(asctime)s: %(message)s')
else:
    rotating_handler = RotatingFileHandler(log_file, maxBytes=1024000, backupCount=1)
    rotating_handler.setFormatter(logging.Formatter('%(asctime)s: %(message)s'))
    rotating_handler.setLevel(logging.DEBUG)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(rotating_handler)


def update_all_webcomics():
    webcomics = get_all_webcomics(WEBCOMIC_LIST_FILE)
    for webcomic_id, webcomic in webcomics.items():
        while True:
            webcomic.process_current_page()
            if webcomic.current_page == 0:
                break


if __name__ == '__main__':
    update_all_webcomics()
