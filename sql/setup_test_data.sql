TRUNCATE webcomics, pages;

INSERT INTO webcomics (name, main_url, description)
VALUES ('Test Webcomic', 'http://testwebcomic.com', 'A test webcomic');

INSERT INTO webcomics (name, main_url, description)
VALUES ('XKCD', 'http://xkcd.com', 'A webcomic of romance, sarcasm, math, and language.');


INSERT INTO pages (page_nb, url, title, webcomic_id)
VALUES
('0', 'http://xkcd.com/1/', 'Barrel - Part 1', (SELECT id from webcomics WHERE name='XKCD')),
('1', 'http://xkcd.com/2/', 'Petit Trees (sketch)', (SELECT id from webcomics WHERE name='XKCD')),
('2', 'http://xkcd.com/3/', 'Island (sketch)', (SELECT id from webcomics WHERE name='XKCD'));
