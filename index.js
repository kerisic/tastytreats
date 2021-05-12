require('dotenv').config()
const admin = require('firebase-admin');
const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');
const port = process.env.PORT || 8080;
const app = express();
const {
  body,
  validationResult
} = require('express-validator');

const serviceAccount = require('./public/scripts/serviceAccountKey.json');
const { database } = require('firebase-admin');
const { Console } = require('console');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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
        return res.send("Captcha failed... Humans allowed only!");
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

      const docRef = db.collection('inquiries').doc(name+date);

      docRef.set({
        name: data.name,
        email: data.email,
        message: data.message,
        newsletter: data.newsletter
      });

      fs.writeFile(path, contactInfo, (err) => {
        if (err) throw err;
        console.log('form data saved!');
      });

      res.sendFile('public/view/thanks.html', {
        root: __dirname
      });
    });
  });

app.get('/inquiries', async (req, res) => {
  const inquiriesRef = db.collection('inquiries');
  const snapshot = await inquiriesRef.get();
  let inquiries = [];
  snapshot.forEach(doc => {
  inquiries.push({
    name: doc.data().name,
    email: doc.data().email,
    message: doc.data().message,
    newsletter: doc.data().newsletter
  })
  });
  res.json(inquiries);
});

app.get('/show', function (req, res) {
  res.sendFile('public/view/inquiries.html', {
    root: __dirname
  });
});

app.listen(port, () => console.log(`Started server at http://localhost:8080!`));