from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic


def get_all_webcomics():
    xkcd = URLPatternWebcomic("XKCD", "https://xkcd.com/{}/")
    mcninja = NextPageLinkWebcomic("Dr. McNinja", "http://drmcninja.com/archives/comic/1p1/", mcninja_next)

    return [xkcd, mcninja]


def mcninja_next(soup):
    next_link = soup.find('a', class_='next')
    if next_link:
        return next_link.get('href')
    else:
        current_url = soup.find('link', rel='canonical').get('href')
        page_nb = current_url.split('/')[-2]
        series_nb = int(page_nb.split('p')[0])
        if series_nb < 33:
            return "http://drmcninja.com/archives/comic/{}p1/".format(series_nb+1)
        else:
            return None
