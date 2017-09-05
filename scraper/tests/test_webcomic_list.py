import unittest
import requests
from bs4 import BeautifulSoup

import webcomic_list
from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic


class WebcomicListTests(unittest.TestCase):
    def test_get_all_webcomics(self):
        webcomics = webcomic_list.get_all_webcomics('tests/webcomics_test.yaml')
        self.assertEquals(len(webcomics), 3)

        xkcd = webcomics['xkcd']
        xkcd_no_exceptions = webcomics['pattern_no_exceptions']
        mcninja = webcomics['mcninja']

        self.assertIs(type(xkcd), URLPatternWebcomic)
        self.assertIs(type(xkcd_no_exceptions), URLPatternWebcomic)
        self.assertIs(type(mcninja), NextPageLinkWebcomic)

        self.assertEquals(len(xkcd.exception_dictionary), 1)
        self.assertEquals(xkcd.exception_dictionary[0]['from'], 'https://xkcd.com/403/')
        self.assertEquals(xkcd.exception_dictionary[0]['to'], 'https://xkcd.com/404/')
        self.assertEquals(len(xkcd_no_exceptions.exception_dictionary), 0)

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

