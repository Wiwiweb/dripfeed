import requests
from Webcomic import Webcomic, PageReturn


class URLPatternWebcomic(Webcomic):
    def __init__(self, name, scraper_id, url_pattern, exception_dictionary=None):
        super().__init__(name, scraper_id)
        self.url_pattern = url_pattern
        if exception_dictionary is None:
            self.exception_dictionary = {}
        else:
            self.exception_dictionary = exception_dictionary

    def get_info_from_page(self):
        if self.current_url in self.exception_dictionary:
            return PageReturn(self.exception_dictionary[self.current_url], self.current_url)
        next_url = self.url_pattern.format(self.current_page + 1)
        req = requests.get(next_url)
        if req.ok:
            return PageReturn(next_url, self.current_url)
        else:
            return PageReturn(None, self.current_url)
