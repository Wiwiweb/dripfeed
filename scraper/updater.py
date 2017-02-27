from webcomic_list import get_all_webcomics


def update_all_webcomics():
    webcomic_list = get_all_webcomics()
    for webcomic in webcomic_list:
        while True:
            webcomic.get_and_process_next_page()
            if webcomic.current_page == 0:
                break
