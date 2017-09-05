import unittest
from NextPageLinkWebcomic import NextPageLinkWebcomic
from Webcomic import PageReturn


class NextPageLinkTests(unittest.TestCase):
    def test_process_current_page(self):
        def mcninja_next(soup):
            return PageReturn(soup.find('a', class_='next').get('href'), None)

        mcninja = NextPageLinkWebcomic("Dr. McNinja", "mcninja", "http://drmcninja.com/archives/comic/1p1/", mcninja_next)
        mcninja.current_page = 0
        mcninja.current_url = None

        mcninja.process_current_page()
        self.assertEqual(mcninja.current_page, 1)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p1/")

        mcninja.process_current_page()
        self.assertEqual(mcninja.current_page, 2)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p2/")

        mcninja.process_current_page()
        self.assertEqual(mcninja.current_page, 3)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p3/")

        mcninja.process_current_page()
        self.assertEqual(mcninja.current_page, 4)
        self.assertEqual(mcninja.current_url, "http://drmcninja.com/archives/comic/1p4/")
