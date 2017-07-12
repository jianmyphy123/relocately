# Relocately client side

To run the code, first do an
```
  npm install
  bower install
```

then

```
  gulp
```

to serve files for development. In the window that pops up, you need to add /src?id=8-1 (or whatever number/string you want)..

To deploy the source code, you need to
```
  1. edit the api url in client/src/app/common/services/inventoryService.js, line 7
  2. gulp build:dist
  3. copy all files in /client_build/dist/ to web server root

```
