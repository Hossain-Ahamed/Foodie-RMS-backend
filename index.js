const dotenv = require('dotenv')
const express = require("express");
const app = express();





dotenv.config({path:"./Server/config.env"})
const port = process.env.PORT || 5000;





app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
  });


  

  app.get('/', (req, res) => {
    res.send('gogoshop server is running');
})