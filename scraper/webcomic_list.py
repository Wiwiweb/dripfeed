import logging
import requests
import yaml
from bs4 import BeautifulSoup

from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic
from Webcomic import PageReturn

logger = logging.getLogger()


def get_all_webcomics(filename):
    webcomic_dict = {}
    with open(filename, 'r') as file:
        webcomics = yaml.load(file)
        for scraper_id, content in webcomics.items():
            if content['type'] == 'url_pattern':
                if 'exceptions' not in content:
                    content['exceptions'] = []
                webcomic = URLPatternWebcomic(content['name'], scraper_id, content['pattern'], content['exceptions'])
                webcomic_dict[scraper_id] = webcomic
            elif content['type'] == 'next_page_link':
                next_method_name = scraper_id + '_info'
                if next_method_name not in globals():
                    logger.warning("next_page_link type '{0}' doesn't have an info method! "
                                   "You must create a {0}_info method in the webcomic_list.py file, "
                                   "returning at least the next url".format(scraper_id))
                    continue
                next_method = globals()[next_method_name]
                webcomic = NextPageLinkWebcomic(content['name'], scraper_id, content['first_page'], next_method)
                webcomic_dict[scraper_id] = webcomic
            else:
                logger.warning("Invalid webcomic type! {}: {}".format(scraper_id, content['type']))
    return webcomic_dict


def mcninja_info(soup, current_title=None):
    if current_title is None:
        current_series = soup.find('select', id='series_select').find('option', selected=True).string
        current_page = soup.find('select', id='page_select').find('option', selected=True).string
        current_title = '{} p{}'.format(current_series, current_page)

    next_link = soup.find('link', rel='next')
    if next_link:
        next_url = next_link.get('href')
        if '/archives/comic/' in next_url:
            # We found the next page
            return PageReturn(next_url, current_title)
        else:
            # This next url is just a news post, fetch it recursively to find the real next comic page
            req = requests.get(next_url)
            soup = BeautifulSoup(req.text, "html.parser")
            return mcninja_info(soup, current_title)
    else:
        # The last page
        return PageReturn(None, current_title)


def cucumber_quest_info(soup):
    current_title = soup.find('header', class_='post-header').find('h1').string
    next_link_button = soup.find('a', class_='next-webcomic-link')
    if 'current-webcomic' in next_link_button['class']:
        next_link = None
    else:
        next_link = next_link_button.get('href')
    return PageReturn(next_link, current_title)


def smbc_info(soup):
    trim_length = len("Saturday Morning Breakfast Cereal - ")
    current_title = soup.find('title').string[trim_length:]
    next_link_button = soup.find('a', class_='next')
    if next_link_button is None:
        next_link = None
    else:
        next_link = next_link_button.get('href')
    return PageReturn(next_link, current_title)
