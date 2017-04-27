import os
import psycopg2

FIXTURES_FILE = '../sql/test_fixtures.sql'

db_url = os.getenv('OPENSHIFT_POSTGRESQL_DB_URL')
if db_url is None:
    db_url = 'postgresql://postgres:postgres@127.0.0.1:5432/'

debug = os.getenv('NODE_ENV') != 'production'
if debug:
    db_name = 'testing'
else:
    db_name = 'dripfeed'


def query(sql, values=None):
    with psycopg2.connect("{}{}".format(db_url, db_name)) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, values)
            try:
                return cursor.fetchall()
            except psycopg2.ProgrammingError:
                # No results to fetch
                return []


def reload_fixtures():
    file = open(FIXTURES_FILE, 'r')
    query(file.read())
