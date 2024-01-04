const dotenv = require('dotenv')
const express = require("express");
const app = express();
const connectDB = require("./server/config/database");




dotenv.config({path: "./config.env"});
const port = process.env.PORT || 5000;


connectDB();




app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
  });


  

  app.get('/', (req, res) => {
    res.send('gogoshop server is running');
})