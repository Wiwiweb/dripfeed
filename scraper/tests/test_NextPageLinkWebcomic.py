import unittest
from NextPageLinkWebcomic import NextPageLinkWebcomic


class NextPageLinkTests(unittest.TestCase):
    def test_get_next_page(self):
        def mcninja_next(soup):
            return soup.find('a', class_='next').get('href')

        mcninja = NextPageLinkWebcomic("Dr. McNinja", "mcninja", "http://drmcninja.com/archives/comic/1p1/", mcninja_next)
        mcninja.current_page = 0
        mcninja.current_url = None

        mcninja.get_next_page_and_update_state()
        self.assertEqual(mcninja.current_page, 1)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p1/")

        mcninja.get_next_page_and_update_state()
        self.assertEqual(mcninja.current_page, 2)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p2/")

        mcninja.get_next_page_and_update_state()
        self.assertEqual(mcninja.current_page, 3)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p3/")

        mcninja.get_next_page_and_update_state()
        self.assertEqual(mcninja.current_page, 4)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p4/")
