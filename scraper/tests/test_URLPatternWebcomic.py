import unittest
from URLPatternWebcomic import URLPatternWebcomic


class URLPatternWebcomicTests(unittest.TestCase):
    def test_get_next_page(self):
        xkcd_exceptions = {"https://xkcd.com/403/": "https://xkcd.com/404/"}
        xkcd = URLPatternWebcomic("XKCD", "xkcd", "https://xkcd.com/{}/", xkcd_exceptions)
        xkcd.current_page = 402
        xkcd.current_url = "https://xkcd.com/402/"

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 403)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/403/")

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 404)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/404/")

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 405)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/405/")
