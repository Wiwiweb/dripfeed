from abc import ABC, abstractmethod
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


class Webcomic(ABC):
    def __init__(self):
        self.current_page = 0
        self.current_url = None

    def get_and_process_next_page(self):
        self.get_next_page_and_update_state()
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
        # TODO
        pass
