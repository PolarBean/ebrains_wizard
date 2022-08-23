// Get modules that are needed for the server
const express = require('express');        // Express is a framework for creating web apps
const path = require('path');              // Path is used for creating file paths
const bodyparser = require('body-parser'); // Body-parser is needed for parsing incoming request bodies
const nodemailer = require('nodemailer');  // Nodemailer is used for sending emails

const cors = require('cors');              // CORS is used to allow interaction between front-end and backend during development. Should be turned off before deployment


// This app is deployed on OpenShift, and containers in OpenShift should bind to
// any address, which is designated with 0.0.0.0 and use port 8080 by default
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;

// Create the express app
const app = express()
//app.use(cors())

app.set('view engine', 'ejs'); Necessary??
app.set('views', path.join(__dirname, '/src'));  Necessary??
app.use(express.static(path.join(__dirname, '/src')));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

// TODO:
// Have Node serve the files for our built React app
// Question: Will __dirname work??




// Only for development
// const creds = require('./config');


var transport = {
  host: 'smtp.gmail.com', // e.g. smtp.gmail.com
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('All works fine, congratz!');
  }
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// GENERIC Example, but index.html does not exist??
// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'src', 'index.html')); 
// });

app.get('/', function(req, res) {
  res.render('index')
});


app.get("/api", (req, res) => {
  console.log("hello world!")
  res.json({ message: "Hello from server!" });
});


// create a GET route
app.get('/express_backend', (req, res) => {
  console.log("backend connected....")
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// API calls
app.get('/api/hello', (req, res) => {
    console.log('Hello From Express');
    res.send({ express: 'Hello From Express' });
  });

app.post('/api/sendmail', (req, res) => {
    console.log('Email submission completed');
    console.log(req.body)

    const jsonForm = JSON.stringify( req.body );

    var mailOptions = {
      from: 'ehennestad@gmail.com',
      to: 'eivind.hennestad@medisin.uio.no',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
      attachments: [
        {   // utf-8 string as an attachment
            filename: 'metadata.json',
            content: jsonForm
        }
      ]
    };

    //form_data = req.get_json()
    //console.log(form_data)

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  });




