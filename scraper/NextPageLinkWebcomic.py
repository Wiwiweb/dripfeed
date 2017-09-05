import requests
from bs4 import BeautifulSoup
from Webcomic import Webcomic


class NextPageLinkWebcomic(Webcomic):
    def __init__(self, name, scraper_id, first_page_url, next_page_link_finder_function):
        super().__init__(name, scraper_id)
        self.first_page_url = first_page_url
        self.next_page_link_finder_function = next_page_link_finder_function

    def get_next_page_url(self):
        if self.current_page == 0:
            return self.first_page_url
        req = requests.get(self.current_url)
        soup = BeautifulSoup(req.text, "html.parser")
        return self.next_page_link_finder_function(soup)
