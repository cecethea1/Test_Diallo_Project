# THM-Insight

## Setup DB
---
NB : Vous devez avoir PgAdmin d'installer avec l'extension POSTGIS (via Application Stack Builder)
Create a database and run scripts in `backend/SQL`:
```
cd backend/SQL
psql "postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>" -f schema.sql
psql "postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>" -f insert.sql

NB : Si vous avez une option, tapez "\i schema.sql ou \i insert.sql pour run les scripts
```

## Start API
---
NB : Copier .env.local et renommer en .env (command ren "avant" "apres" sur W10). Modifier avec les paramètres de la DB
Setup `.env` file in `backend/api` with DB parameters.
Start server on port `3000` (should be by default).

```
cd backend/api
npm install
npm start
```

## Start Frontend
---
NB : dans package.json, remplacer start-win par start (sur W10). 
Start server on port `3001` (should be by default).
```
cd front
npm install
npm start
```

## Ansible Deployment
---

[:link: deployment instructions](ansible/README.md)

