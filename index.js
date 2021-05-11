const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));
