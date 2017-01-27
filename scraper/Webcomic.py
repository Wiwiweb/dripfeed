from abc import ABC, abstractmethod


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
            # TODO error
            pass

    @abstractmethod
    def get_next_page_url(self):
        pass

    def add_current_page_to_db(self):
        # TODO
        pass
