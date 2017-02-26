from URLPatternWebcomic import URLPatternWebcomic
from NextPageLinkWebcomic import NextPageLinkWebcomic

def get_all_webcomics():
    xkcd = URLPatternWebcomic("XKCD", "https://xkcd.com/{}/")
    mcninja = NextPageLinkWebcomic("Dr. McNinja", "http://drmcninja.com/archives/comic/1p1/", mcninja_next)

    return [xkcd, mcninja]


def mcninja_next(soup):
    next_link = soup.find('a', class_='next')
    if next_link:
        return next_link
    else:
        series_select = soup.find('select', id='series_select')
        next_series = series_select.find('option', selected='selected').find_next('option')
        return next_series