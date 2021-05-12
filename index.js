require('dotenv').config()
const admin = require('firebase-admin');
const cors = require('cors')
const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');
const port = process.env.PORT || 8080;
const app = express();
const { body, validationResult } = require('express-validator');

const serviceAccount = require('./public/scripts/serviceAccountKey.json');
const e = require('express');
const { Console } = require('console');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));
app.use(cors())

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

    let secretKey = process.env.SECRETKEY;
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey +
      "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;

    request(verificationUrl, function (error, response, body) {
      body = JSON.parse(body);

      if (body.success !== undefined && !body.success) {
        return res.send("Captcha failed... Humans allowed only!");
      }

      let newsletter;
      if (req.body.newsletter === "Yes") {
        newsletter = "Yes"
      } else {
        newsletter = "No"
      }

      let data = req.body
      let contactInfo = `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
        Newsletter Subcription: ${newsletter}
        `;

      let name = data.name.split(" ").join("");
      let date = new Date().toISOString();
      
      const docRef = db.collection('inquiries').doc(name + date);

      docRef.set({
        name: data.name,
        email: data.email,
        message: data.message,
        newsletter: newsletter,
        timestamp: admin.firestore.Timestamp.now(),
      });

      let path = 'data/' + name + date + '.txt';
      
      if (process.env.HEROKU !== true) {
        fs.writeFile(path, contactInfo, (err) => {
          if (err) throw err;
          console.log('form data saved!');
        });
      }

      res.sendFile('public/view/thanks.html', {
        root: __dirname
      });
    });
  });

app.get('/inquiries', async (req, res) => {
  const inquiriesRef = db.collection('inquiries').orderBy('timestamp', 'desc');
  const snapshot = await inquiriesRef.get();
  let inquiries = [];
  snapshot.forEach(doc => {
    inquiries.push({
      name: doc.data().name,
      email: doc.data().email,
      message: doc.data().message,
      newsletter: doc.data().newsletter,
      timestamp: doc.data().timestamp.toDate()
    })
  });
  res.json(inquiries);
});

app.get('/show', function (req, res) {
  res.sendFile('public/view/inquiries.html', {
    root: __dirname
  });
});

app.get('*', function(req, res){
  res.status(404).send('Page not found!');
});

app.listen(port, () => console.log(`Started server at http://localhost:8080!`));