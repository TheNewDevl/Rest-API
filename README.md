To run and use this API you need to follow these steps:

1) Make sure you have nodeJS and npm installed in you computer

2) Clone the repo

3) In the root folder of the project, run the command `npm install` from the terminal

4) src/utils/config.ts manages .env variables. 
You will be able to choose the port to be used, and use your own database. 
To do this, you will simply have to create a file at the root containing the following informations :
    PORT= the port you wanne use (app will listen by default on port 3000)
    LOG=the log for your database, you should pass a mongo uri
    KEY=secret key for tokens
    NODE_ENV=development
Make sur to never push your .env file to any repository

5) After, please, use `npm run dev` it will compile typescript, run the server and create the necessary dirs you will need and both stay listening for any changes. 
!! If you prefer you can run separately `npm run compile`(will compile TS) and `npm run server` to run server. !!

6) You can also run the tests suits running command `npm run test`. Don't hesitate to run this if you change anything in source code. 

Hope you will enjoy this :) !