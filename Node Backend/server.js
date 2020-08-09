const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const api= require('./routes/api');
var app = express();
//using cors to access the resources from different origin
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use('/api', api);

app.listen(process.env.PORT  || 4000, (err,res)=>{
  console.log("Server is running on" + process.env.PORT  || 4000);
});
