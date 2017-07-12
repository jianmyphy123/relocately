# Relocately server application


## 1. Install dependencies
Run the following command:
```
  npm install
```

Also install `libfontconfig` to be able to generate PDF files

## 2. Configure database connection settings

### 2.1 Use the `config` file
Change the following options to your liking:

The defaults are:

```
  POSTGRES_HOST=localhost
  POSTGRES_DB_NAME=relocately_db
  POSTGRES_USER=relocately_db_user
  POSTGRES_PASSWORD=F2YwVCDXs8jK6fDh
  PORT=3000
```

### 2.2 Use environment variables

You can overwrite the options in the `config` file by using environment variables:
```
  export POSTGRES_HOST=my.own.db.server.com
```

## 3. Run the application
To run the application on a server in the background you must install [pm2](http://pm2.keymetrics.io/):
```
  npm install -g pm2
```

And then run the application:
```
  pm2 start index.js --name "relocately"
```

# Extra information

## Viewing application logs
Run the following command to see application logs:
```
  pm2 logs relocately
```

## Restarting the application (i.e. after update)
After deploying/checking out the new version, run the following command:
```
  pm2 restart relocately
```

!! Ensure your environment variables are still up to date if you have used option #2.2

# Import from google docs DB:
 1. Save gdocs as csv
 2. Remove first line (with comments). Replace second line with
 ```
type,category,name_de,name_en,length,width,depth,dismantling_factor,weight,replacement_value,amount,dismantling,packed_by,unpacked,assembling,one_man_handling,crate
```
 3. go to http://www.csvjson.com/csv2json an paste there, get the JSON
 4. `pg_dump --host localhost --port 5432 --username ioi --format plain -FC --file new.backup --table template_items ioi`
 5. `psql --host localhost --username ioi ioi`: `DROP TABLE template_items;`
 5. `pg_restore --host localhost --username ioi --dbname "ioi" --table template_items --verbose new.backup`
