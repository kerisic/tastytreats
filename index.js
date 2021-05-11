require('dotenv').config()
const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');
const port = process.env.PORT || 8080;
const app = express();
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/public", express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/contact',
  body('email').isEmail().normalizeEmail(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send("Email is invalid!");
    }

    var secretKey = process.env.SECRETKEY;
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey +
      "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;

    request(verificationUrl, function (error, response, body) {
      body = JSON.parse(body);

      if (body.success !== undefined && !body.success) {
        return res.send("Humans allowed only!");
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

  });

app.listen(port, () => console.log(`Started server at http://localhost:8080!`));