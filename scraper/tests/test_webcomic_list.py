import unittest
import requests
from bs4 import BeautifulSoup

import webcomic_list
from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic
from Webcomic import PageReturn


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
        expected_results = \
            {"http://drmcninja.com/archives/comic/5p52/": PageReturn("http://drmcninja.com/archives/comic/7p1/",
                                                                     "D.A.R.E To Resist Ninja Drugs and Ninja Violence Part 2 p52"),
             "http://drmcninja.com/archives/comic/11p16/": PageReturn("http://drmcninja.com/archives/comic/11p17/",
                                                                      "Punch Dracula p16"),
             "http://drmcninja.com/archives/comic/11p56/": PageReturn("http://drmcninja.com/archives/comic/12p1/",
                                                                      "Punch Dracula p56"),
             "http://drmcninja.com/archives/comic/33p147/": PageReturn(None,
                                                                       "The End: Part 2 p147")}
        self.next_method_asserts(webcomic_list.mcninja_info, expected_results)

    def test_cucumber_quest_next(self):
        req = requests.get("http://cucumber.gigidigi.com/cq/page-1/")
        soup = BeautifulSoup(req.text, "html.parser")
        last_page_url = soup.find('a', class_='last-webcomic-link').get('href')
        req = requests.get(last_page_url)
        soup = BeautifulSoup(req.text, "html.parser")
        last_page_title = soup.find('header', class_='post-header').find('h1').string
        expected_results = \
            {"http://cucumber.gigidigi.com/cq/page-1/": PageReturn("http://cucumber.gigidigi.com/cq/page-2/",
                                                                   "page 1"),
             "http://cucumber.gigidigi.com/cq/page-77/": PageReturn("http://cucumber.gigidigi.com/cq/bonus/",
                                                                    "page 77"),
             last_page_url: PageReturn(None, last_page_title)}
        self.next_method_asserts(webcomic_list.cucumber_quest_info, expected_results)

    def test_smbc_next(self):
        req = requests.get("https://www.smbc-comics.com/comic/2002-09-05")
        soup = BeautifulSoup(req.text, "html.parser")
        last_page_url = soup.find('a', class_='last').get('href')
        req = requests.get(last_page_url)
        soup = BeautifulSoup(req.text, "html.parser")
        trim_length = len("Saturday Morning Breakfast Cereal - ")
        last_page_title = soup.find('title').string[trim_length:]
        expected_results = \
            {"https://www.smbc-comics.com/comic/2002-09-05": PageReturn("https://www.smbc-comics.com/comic/2002-09-07",
                                                                        "2002-09-05"),
             "https://www.smbc-comics.com/comic/the-truth": PageReturn(
                 "https://www.smbc-comics.com/comic/statistical-flowers-for-algernon",
                 "The Truth"),
             last_page_url: PageReturn(None, last_page_title)}
        self.next_method_asserts(webcomic_list.smbc_info, expected_results)

    def next_method_asserts(self, method, expected_results):
        for url in expected_results:
            req = requests.get(url)
            soup = BeautifulSoup(req.text, "html.parser")
            result = method(soup)
            expected = expected_results[url]
            self.assertEquals(result, expected, "Failed on " + url)
