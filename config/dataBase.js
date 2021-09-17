const dotenv = require ("dotenv").config();
const mongoose = require ("mongoose");





function connectDB(){
   // Database connection

   mongoose.connect(process.env.Mongo_Connection_URL, 
    {useNewUrlParser: true, 
        useUnifiedTopology: true}
        );

   const connection = mongoose.connection;
    
   
   connection.once('open', () => {
           console.log("Connected to DataBase.");        
   });
   
   
       
   

};


module.exports = connectDB;