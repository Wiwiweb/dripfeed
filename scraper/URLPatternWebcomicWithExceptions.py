import requests
from Webcomic import Webcomic


class URLPatternWebcomicWithExceptions(Webcomic):
    def __init__(self, name, url_pattern, exception_dictionary):
        super().__init__(name)
        self.url_pattern = url_pattern
        self.exception_dictionary = exception_dictionary

    def get_next_page_url(self):
        if self.current_url in self.exception_dictionary:
            return self.exception_dictionary[self.current_url]
        next_url = self.url_pattern.format(self.current_page + 1)
        req = requests.get(next_url)
        if req.ok:
            return next_url
        else:
            return None
