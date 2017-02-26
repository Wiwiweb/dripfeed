import unittest
import db
from URLPatternWebcomic import URLPatternWebcomic


class WebcomicTests(unittest.TestCase):
    def test_get_webcomic_id(self):
        webcomic_name = "XKCD"
        self.assertTrue(webcomic_exists(webcomic_name), "Fixture error: webcomic doesn't exist")

        xkcd = URLPatternWebcomic(webcomic_name, "")
        self.assertTrue(webcomic_exists(webcomic_name))
        self.assertIsNotNone(xkcd.webcomic_id)

    def test_create_webcomic_id(self):
        webcomic_name = "Some Comic"
        self.assertFalse(webcomic_exists(webcomic_name), "Fixture error: webcomic already exists")

        some_comic = URLPatternWebcomic(webcomic_name, "")
        self.assertTrue(webcomic_exists(webcomic_name))
        self.assertIsNotNone(some_comic.webcomic_id)

    def test_add_current_page_to_db(self):
        xkcd = URLPatternWebcomic("XKCD", "https://xkcd.com/{}/")
        xkcd.current_page = 123
        xkcd.current_url = "https://xkcd.com/123/"
        self.assertFalse(page_exists(xkcd.webcomic_id, xkcd.current_page), "Fixture error: Page already exists")

        xkcd.add_current_page_to_db()
        self.assertTrue(page_exists(xkcd.webcomic_id, xkcd.current_page))


def webcomic_exists(name):
    sql = "SELECT id FROM webcomics WHERE name=(%s)"
    results = db.query(sql, [name])
    return len(results) > 0


def page_exists(webcomic_id, page_nb):
    sql = "SELECT * FROM pages WHERE webcomic_id=(%s) AND page_nb=(%s)"
    results = db.query(sql, [webcomic_id, page_nb])
    return len(results) > 0
