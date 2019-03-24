# Progress
### Developing
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
