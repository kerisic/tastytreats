const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const {
  body,
  validationResult
} = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/public", express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/contact',
  body('email').isEmail().normalizeEmail(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send("Email is invalid!");
    }

    let data = req.body
    let contactInfo = `
      Name: ${data.name}
      Email: ${data.email}
      Message: ${data.message}
      Newsletter Subcription: ${data.newsletter}
      `;

    let name = data.name.split(" ").join("");
    let date = new Date().toISOString();
    let path = 'data/' + name + date + '.txt';

    fs.writeFile(path, contactInfo, (err) => {
      if (err) throw err;
      console.log('form data saved!');
    });

    res.send("Thank you for your contact, we'll be in touch soon!")
  });

app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));