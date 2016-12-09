TRUNCATE webcomics, pages;

INSERT INTO webcomics (name, main_url)
VALUES ('Test Webcomic', 'http://testwebcomic.com');

INSERT INTO webcomics (name, main_url)
VALUES ('XKCD', 'http://xkcd.com');


INSERT INTO pages (page_nb, url, webcomic_id)
VALUES ('0', 'http://xkcd.com/1/', (SELECT id from webcomics WHERE name='XKCD'));

INSERT INTO pages (page_nb, url, webcomic_id)
VALUES ('1', 'http://xkcd.com/2/', (SELECT id from webcomics WHERE name='XKCD'));

INSERT INTO pages (page_nb, url, webcomic_id)
VALUES ('2', 'http://xkcd.com/3/', (SELECT id from webcomics WHERE name='XKCD'));
