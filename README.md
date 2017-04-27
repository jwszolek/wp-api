# wp-api
Wordpress API based on nodejs. This is a simple nodeJS project that allows you to communicate with wordpress(https://wordpress.com/) over WebAPI.
The purpose of that project was to get some knowledge about building communication between MySQL and NodeJS.


## API methods
All API methods are described in the api-doc folder

## Build
This is how you can build and expose the project on port 8889

```
npm install
node app.js

```

## Configure
Change Basic Authorisation settings in app.js
Change MySQL Authorisation settings in Routers/*

## TODO
* Cover more MYSQL tables with Web-API
* Keep connection details in one central place
* Travis CI needs to be added
