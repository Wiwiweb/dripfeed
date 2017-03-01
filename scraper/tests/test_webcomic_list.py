import unittest
import requests
from bs4 import BeautifulSoup

import webcomic_list


class WebcomicListTests(unittest.TestCase):
    def test_mcninja_next(self):
        expected_results = {"http://drmcninja.com/archives/comic/5p52/": "http://drmcninja.com/archives/comic/7p1/",
                            "http://drmcninja.com/archives/comic/11p16/": "http://drmcninja.com/archives/comic/11p17/",
                            "http://drmcninja.com/archives/comic/11p56/": "http://drmcninja.com/archives/comic/12p1/",
                            "http://drmcninja.com/archives/comic/33p147/": None}

        for url in expected_results:
            req = requests.get(url)
            soup = BeautifulSoup(req.text, "html.parser")
            result = webcomic_list.mcninja_next(soup)
            expected = expected_results[url]
            self.assertEquals(result, expected)
