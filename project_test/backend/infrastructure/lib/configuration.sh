sudo apt-get update && \
# sudo apt-get install -y postgis
sudo -u postgres psql -c "CREATE USER thminsight WITH ENCRYPTED PASSWORD 'toto';" && \
sudo -u postgres psql -c "CREATE DATABASE thminsight WITH OWNER thminsight;" && \
echo "host    thminsight      thminsight      0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/11/main/pg_hba.conf && \
echo "listen_addresses = '*'                  # what IP address(es) to listen on;" | sudo tee -a /etc/postgresql/11/main/postgresql.conf && \
sudo service postgresql restart
