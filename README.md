## To run and use this API you need to follow these steps:

* Make sure you have nodeJS and npm installed in you computer

* Clone the repo

## BACKEND:
* In the back folder of the project, run the command `npm install` from the terminal

* src/utils/config.ts manages .env variables. 
    Create a .env file following this eg 
        PORT=number
        LOG=your complete uri eg :"mongodb+srv://username:password@....."
        KEY="YOURSUPERSECRETKEY"
        NODE_ENV=development
    Never commit your .env file

* After, use `npm run dev`. it will compile typescript, run the server and create the necessary dirs you will need and both stay listening for any changes. 

!!!!!! If you prefer you can run separately `npm run compile` + `npm run server`


## TEST
Run `npm run test` to run all functional tests . Don't hesitate to run this if you change anything in source code. 

Hope you will enjoy this :) !

## TO RUN FRONT APP GO TO FRONT DIR AND FOLLOW THE INCLUDED MD