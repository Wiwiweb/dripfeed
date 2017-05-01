import logging
import requests
import yaml
from bs4 import BeautifulSoup

from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic

logger = logging.getLogger()


def get_all_webcomics(filename):
    webcomic_dict = {}
    with open(filename, 'r') as file:
        webcomics = yaml.load(file)
        for webcomic_id, content in webcomics.items():
            if content['type'] == 'url_pattern':
                if 'exceptions' not in content:
                    content['exceptions'] = []
                webcomic = URLPatternWebcomic(content['name'], content['pattern'], content['exceptions'])
                webcomic_dict[webcomic_id] = webcomic
            elif content['type'] == 'next_page_link':
                next_method_name = webcomic_id + '_next'
                if next_method_name not in globals():
                    logger.warning("next_page_link type '{0}' doesn't have a next method! "
                                   "You must create a {0}_next method in the webcomic_list.py file".format(webcomic_id))
                    continue
                next_method = globals()[next_method_name]
                webcomic = NextPageLinkWebcomic(content['name'], content['first_page'], next_method)
                webcomic_dict[webcomic_id] = webcomic
            else:
                logger.warning("Invalid webcomic type! {}: {}".format(webcomic_id, content['type']))
    return webcomic_dict


def mcninja_next(soup):
    next_link = soup.find('link', rel='next')
    if next_link:
        next_url = next_link.get('href')
        if '/archives/comic/' in next_url:
            return next_url
        else:
            req = requests.get(next_url)
            soup = BeautifulSoup(req.text, "html.parser")
            return mcninja_next(soup)
    else:
        return None
