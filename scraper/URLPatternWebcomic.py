import requests
from Webcomic import Webcomic


class URLPatternWebcomic(Webcomic):
    def __init__(self, name, url_pattern):
        super().__init__(name)
        self.url_pattern = url_pattern

    def get_next_page_url(self):
        next_url = self.url_pattern.format(self.current_page + 1)
        req = requests.get(next_url)
        if req.ok:
            return next_url
        else:
            return None
