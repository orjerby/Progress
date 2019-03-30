# Progress
### Developing
first you must create replica set by doing those steps:  
go into cmd.  
```
cd [path_to_bin folder_in_mongodb_folder]
mkdir -p rs1 rs2 rs3
mongod --replSet orjerby --logpath "1.log" --dbpath rs1 --port 27017
```
let the window stay open in the background.  
open 2 more cmd windows in the same folder.
```
mongod --replSet orjerby --logpath "2.log" --dbpath rs2 --port 27018
mongod --replSet orjerby --logpath "3.log" --dbpath rs3 --port 27019
```
let them stay open in the background.  
open one more cmd window in the same folder.
```
mongo
```
```
config = {_id: "orjerby", members: [
    {_id: 0, host: "localhost:27017"},
    {_id: 1, host: "localhost:27018"},
    {_id: 2, host: "localhost:27019"} ]
};
rs.initiate(config);
```

in the server folder, create config/dev.env file and copy the code:
```
PORT=3001
MONGODB_URL=mongodb://127.0.0.1:27017/progress
```
npm install from root folder.  
npm install from client folder.  
npm install from server folder.  
npm run dev from root folder.  
  
server will open on port 3001 and client will open on port 3000.  
once live(heroku), both will be on the same port(server).  
### Testing
in the server folder, create config/test.env file and copy the code:  
```
PORT=3001
MONGODB_URL=mongodb://127.0.0.1:27017/progress-test
```
npm run test from server folder.
