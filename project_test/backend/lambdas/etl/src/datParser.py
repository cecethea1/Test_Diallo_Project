import pandas as pd


def parseFile(pathname):
    data = pd.read_csv(pathname,sep=',',header=[1],index_col=0,skiprows=[2,3],parse_dates=True,low_memory=False)
    data.index = pd.to_datetime(data.index,errors='coerce')
    data = data.loc[data.index.dropna()]
    #data = data.dropna(subset=index)
    return data


def getNewData(table,configuration,date):
    #filtre sur les dates
    table = table[(table.index>date)]
    res=[]
    if(len(table)>0):
        for _ , row  in configuration[['alias','captorId','metricId']].iterrows():
            request=""
            for index, value in table[row['alias']].iteritems():
                for captor in row['captorId']:
                    request += ("('{}','{}','{}','{}'),".format(index,value,captor,row['metricId']))
            res.append(request)
    else:
        print('no new value')
    return res