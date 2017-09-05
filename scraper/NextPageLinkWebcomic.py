import requests
from bs4 import BeautifulSoup
from Webcomic import Webcomic, PageReturn


class NextPageLinkWebcomic(Webcomic):
    def __init__(self, name, scraper_id, first_page_url, page_info_function):
        super().__init__(name, scraper_id)
        self.first_page_url = first_page_url
        self.page_info_function = page_info_function

    def get_info_from_page(self):
        if self.current_page == 0:
            return PageReturn(self.first_page_url, None)
        req = requests.get(self.current_url)
        soup = BeautifulSoup(req.text, "html.parser")
        return self.page_info_function(soup)
