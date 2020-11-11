import json
import os
import time
import shutil
from src import datParser as parser
from src import database as db
from src import query
from ftplib import FTP, error_perm
import io
import boto3
from datetime import datetime


#ftp credentials
ftp_ip = os.environ['ftp_host']
ftp_username = os.environ['ftp_user']
ftp_password = os.environ['ftp_password']
ftp_working_directory = os.environ['ftp_working_directory']
ftp_file_to_retrieve = os.environ['ftp_file']

bucket_name = os.environ['bucket_name']

#db credentials
db_host=os.environ['db_host']
db_name=os.environ['db_name']
db_user=os.environ['db_user']
db_port=os.environ['db_port']
db_password=os.environ['db_pass']
bucket_name=os.environ['bucket_name']


def run(event, context):
    s3 = boto3.resource('s3')
    queryManager = query.Query(db_host,db_name,db_user,db_port,db_password)
    configs = queryManager.get_config()
    for configuration in configs:
 #       print("------treatment of"+ configuration[0]+"-------")
        file_name = configuration[0]
        last_treatment = configuration[1]
        ftp_ip = configuration[2]
        ftp_directory = configuration[3]
        config = pd.read_json(json.dumps(configuration[4]))
        try:
            #if other users ?
            ftp = FTP(ftp_ip)
            ftp.login(user=ftp_username, passwd=ftp_password)
        except:
            print("Error connecting to FTP")
        try:
            ftp.cwd(ftp_directory)
        except:
            print("Wrong path in FTP")
        files = ftp.nlst()
        if (file_name in files):
            download_file = io.BytesIO()
            ftp.retrbinary("RETR {}".format(file_name), download_file.write)
            now = datetime.now()
            dt_string = now.strftime("%d_%m_%Y_%H_%M_%S")
            download_file.seek(0)
#            print("File downloaded")
            try:
                data = parser.parseFile(download_file)
#               print("Data parsed")
            except:
                s3.meta.client.upload_fileobj(download_file,bucket_name,"failed/"+file_name+dt_string)
 #               print('cannot extract data , probably error file format')
            newData = parser.getNewData(data, config, last_treatment)
            if(len(newData)>0):
#                print("New Data retrieved")
                try:
                    queryManager.insert_value(newData)
                except:
                    s3.meta.client.upload_fileobj(download_file,bucket_name,"failed/"+file_name+dt_string)
#                print("Data Insert")
                try:
                    response = s3.meta.client.upload_fileobj(download_file,bucket_name,"saved/"+file_name+dt_string)
                except:
                    print('cannot copy file')
                queryManager.setCurrentTimestamp(file_name)
        else:
            print('file not found')