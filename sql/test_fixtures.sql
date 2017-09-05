TRUNCATE webcomics, pages;

-- scraper_id corresponds to the webcomics.yaml hash key
INSERT INTO webcomics (name, main_url, description, scraper_id)
VALUES ('Test Webcomic', 'http://testwebcomic.com', 'A test webcomic', 'test');

INSERT INTO webcomics (name, main_url, description, scraper_id)
VALUES ('XKCD', 'http://xkcd.com', 'A webcomic of romance, sarcasm, math, and language.', 'xkcd');


INSERT INTO pages (page_nb, url, title, webcomic_id)
VALUES
('1', 'https://xkcd.com/1/', 'Barrel - Part 1', (SELECT id from webcomics WHERE name='XKCD')),
('2', 'https://xkcd.com/2/', 'Petit Trees (sketch)', (SELECT id from webcomics WHERE name='XKCD')),
('3', 'https://xkcd.com/3/', 'Island (sketch)', (SELECT id from webcomics WHERE name='XKCD')),
('4', 'https://xkcd.com/4/', 'Landscape (sketch)', (SELECT id from webcomics WHERE name='XKCD')),
('5', 'https://xkcd.com/5/', 'Blown apart', (SELECT id from webcomics WHERE name='XKCD'));
