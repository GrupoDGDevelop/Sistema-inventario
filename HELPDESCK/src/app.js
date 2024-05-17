const express = require('express');
const dotenv = require('dotnev');
const cors = require('cors');

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(CORS());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Proyecto HELPDESCK + CRUD +  MYSQL');
});

app.listen(port,()=>{
    console.log("Port ==> ",port);
});
