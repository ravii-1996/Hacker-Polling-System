//Install express server
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/voting-system'));

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname,'/dist/voting-system/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 7480);
