import requests
from bs4 import BeautifulSoup

from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic


def get_all_webcomics():
    xkcd = URLPatternWebcomic("XKCD", "https://xkcd.com/{}/")
    mcninja = NextPageLinkWebcomic("Dr. McNinja", "http://drmcninja.com/archives/comic/1p1/", mcninja_next)

    return [xkcd, mcninja]


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
