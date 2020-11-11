import pandas as pd
import psycopg2
from psycopg2.extras import register_json

class Database():
    def __init__(self, host, database, user, password, port):
        self.password = password
        self.host = host
        self.db_name = database
        self.user = user
        self.port = port
        self.conn = psycopg2.connect(host=self.host,dbname=self.db_name, user='postgres', password='Ardailler1997', port=5432)
 
        print("Database connected")


    def select(self, query , parameter=[]):
        """
        Connects to database and extracts
        raw tweets and any other columns we
        need
        Parameters:
        ----------------
        arg1: string: SQL query
        Returns: pandas dataframe
        ----------------
        """

        cursor = self.conn.cursor()
        try:
            register_json(oid=3802, array_oid=3807)
            cursor.execute(query,parameter)
        except:
            print ('cant execute query')
            raise
        rows = cursor.fetchall()
        return rows

    def insert(self,query):
        cursor = self.conn.cursor()
        cursor.execute(query)
        self.conn.commit()



