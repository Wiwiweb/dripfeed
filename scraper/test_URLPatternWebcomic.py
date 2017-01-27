import unittest
from URLPatternWebcomic import URLPatternWebcomic


class URLPatternWebcomicTests(unittest.TestCase):
    def test_get_next_page(self):
        xkcd = URLPatternWebcomic("https://xkcd.com/{}/")

        self.assertEqual(xkcd.current_page, 0)
        self.assertIsNone(xkcd.current_url)

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 1)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/1/")

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 2)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/2/")

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 3)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/3/")

        xkcd.get_next_page_and_update_state()
        self.assertEqual(xkcd.current_page, 4)
        self.assertEqual(xkcd.current_url, "https://xkcd.com/4/")
