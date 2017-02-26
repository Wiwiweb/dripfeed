from NextPageLinkWebcomic import NextPageLinkWebcomic
from URLPatternWebcomic import URLPatternWebcomic


def mcninja_next(soup):
    next_link = soup.find('a', class_='next')
    if next_link:
        return next_link
    else:
        series_select = soup.find('select', id='series_select')
        next_series = series_select.find('option', selected='selected').next
        return next_series



if __name__ == '__main__':
    xkcd = URLPatternWebcomic("https://xkcd.com/{}/")
    mcninja = NextPageLinkWebcomic("http://drmcninja.com/archives/comic/0p1/", mcninja_next)

    xkcd.get_next_page_and_update_state()
    print(xkcd.current_url)
    xkcd.get_next_page_and_update_state()
    print(xkcd.current_url)
    xkcd.get_next_page_and_update_state()
    print(xkcd.current_url)
    xkcd.get_next_page_and_update_state()
    print(xkcd.current_url)
    xkcd.get_next_page_and_update_state()
    print(xkcd.current_url)

    mcninja.get_next_page_and_update_state()
    print(mcninja.current_url)
    mcninja.get_next_page_and_update_state()
    print(mcninja.current_url)
    mcninja.get_next_page_and_update_state()
    print(mcninja.current_url)
    mcninja.get_next_page_and_update_state()
    print(mcninja.current_url)
    mcninja.get_next_page_and_update_state()
    print(mcninja.current_url)
