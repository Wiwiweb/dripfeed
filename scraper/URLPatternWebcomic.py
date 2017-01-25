from Webcomic import Webcomic


class URLPatternWebcomic(Webcomic):
    def __init__(self, url_pattern):
        super().__init__()
        self.url_pattern = url_pattern

    def get_next_page_url(self):
        return self.url_pattern.format(self.current_page + 1)
