from src import database
import os
import pandas as pd
import json

class Query:
    def __init__(self,host,db_name,user,port,password):
        self.db =  database.Database(host=host, database=db_name, user=user, port=port, password=password)

    def get_config(self):
        query = "SELECT file_name, last_treatment::timestamp , ftp_ip, ftp_directory, config from config "
        res = self.db.select(query)
        if(len(res)>0):
            return res
        else:
            print("no configuration, stop running")
            exit()
    
    def insert_value(self,values):
        for request in values:
            formated_values=request[:-1]
            query = "INSERT INTO measures (timestamp, value, sensor_id, metric_id) VALUES" +  formated_values + ";"
            res = self.db.insert(query)

    def setCurrentTimestamp(self,filename):
        query = "UPDATE config SET last_treatment = now() where file_name = '"+filename+"'"
        res = self.db.insert(query)


