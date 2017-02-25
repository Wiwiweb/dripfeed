import os
import psycopg2

db_url = os.getenv('OPENSHIFT_POSTGRESQL_DB_URL')
if db_url is None:
    db_url = 'postgresql://postgres:postgres@127.0.0.1:5432'

debug = os.getenv('NODE_ENV') == 'production'
if debug:
    db_name = 'dripfeed'
else:
    db_name = 'testing'


def query(sql, values):
    with psycopg2.connect("{}/{}".format(db_url, db_name)) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, values)
            try:
                return cursor.fetchall()
            except psycopg2.ProgrammingError:
                # No results to fetch
                return []
