import unittest
import db
from URLPatternWebcomic import URLPatternWebcomic


class WebcomicTests(unittest.TestCase):
    def test_get_webcomic_id(self):
        db.reload_fixtures()
        scraper_id = "xkcd"
        self.assertTrue(webcomic_exists(scraper_id), "Fixture error: webcomic doesn't exist")

        xkcd = URLPatternWebcomic("Some Comic", scraper_id, "")
        self.assertTrue(webcomic_exists(scraper_id))
        self.assertIsNotNone(xkcd.webcomic_id)

    def test_create_webcomic_id(self):
        db.reload_fixtures()
        scraper_id = "new_webcomic"
        self.assertFalse(webcomic_exists(scraper_id), "Fixture error: webcomic already exists")

        some_comic = URLPatternWebcomic("Some Comic", scraper_id, "")
        self.assertTrue(webcomic_exists(scraper_id))
        self.assertIsNotNone(some_comic.webcomic_id)

    def test_add_current_page_to_db(self):
        db.reload_fixtures()
        xkcd = URLPatternWebcomic("XKCD", "xkcd", "https://xkcd.com/{}/")
        xkcd.current_page = 123
        xkcd.current_url = "https://xkcd.com/123/"
        self.assertFalse(page_exists(xkcd.webcomic_id, xkcd.current_page), "Fixture error: Page already exists")

        xkcd.add_current_page_to_db()
        self.assertTrue(page_exists(xkcd.webcomic_id, xkcd.current_page))

    def test_get_last_page(self):
        db.reload_fixtures()
        xkcd = URLPatternWebcomic("XKCD", "xkcd", "https://xkcd.com/{}/", "xkcd")
        self.assertTrue(page_exists(xkcd.webcomic_id, 5), "Fixture error: Page doesn't exist")

        page_nb, url = xkcd.get_last_page()
        self.assertEquals(page_nb, 5)
        self.assertEquals(url, "https://xkcd.com/5/")

    def test_get_last_page_no_pages(self):
        db.reload_fixtures()
        webcomic = URLPatternWebcomic("Test Webcomic", "test", "")
        self.assertFalse(page_exists(webcomic.webcomic_id, 1), "Fixture error: Page exists")

        page_nb, url = webcomic.get_last_page()
        self.assertEquals(page_nb, 0)
        self.assertEquals(url, None)


def webcomic_exists(scraper_id):
    sql = "SELECT id FROM webcomics WHERE scraper_id=(%s)"
    results = db.query(sql, [scraper_id])
    return len(results) > 0


def page_exists(webcomic_id, page_nb):
    sql = "SELECT * FROM pages WHERE webcomic_id=(%s) AND page_nb=(%s)"
    results = db.query(sql, [webcomic_id, page_nb])
    return len(results) > 0
