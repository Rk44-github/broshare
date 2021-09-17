const express =  require ("express");
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');

 
const app = express();


//DataBase Connection Setup by requiring the file form config folder file called dataBase //
const DB = require("./config/dataBase");
const connectDB = DB;
connectDB();

// cors
const corsOptions ={
    origin: process.env.AllOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));

//Template engine
app.set('views', path.join(__dirname, '/views' ));
app.set('view engine', 'ejs');


//Defining the custom server port and environment varible port ...// 
//... to be provided by the mongoDB server //
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());

//Routes
app.use("/api/files", require("./routes/files"));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));



app.listen(PORT, () => {
    console.log("Listening on port 3000.");
});