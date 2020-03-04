const express = require('express');
const app = express();
const path = require('path');
const { User } = require("./src/models/user.js");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var expressValidator = require("express-validator");
const PORT = 3000;


var options = {
  database: "db",
  user: "ubuntu",
  port:3306,
  password: "1235012350",
  host: "54.183.110.192",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  };

  
  var sessionStore = new MySQLStore(options);
  

// logs requests to the backend
const morgan = require("morgan");
app.use(morgan("tiny"));

// sets view engine for ejs
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// allows to parse body in http post requests
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json());

// use express session
app.use(
    session({
      secret: "CSC Class",
      saveUninitialized: false,
      store: sessionStore,
      resave: false
    })
  );

app.use(passport.initialize());
app.use(passport.session());


//routes path
const loginRouter = require("./src/routes/loginRoutes");
const homeRouter = require("./src/routes/homeRoutes");
// const chooseHomeRouter = require("./src/routes/chooseHome");

app.use("/", loginRouter);
app.use("/", homeRouter);
// app.use("/", chooseHomeRouter);

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function(email, password, done) {
        const isValid = User.findUser(email, password);
        console.log('email is: '+email);
        console.log('password is: '+password);

        isValid.then(res => {
          if (res != false) {
            return done(null, res);
          }
  
          return done(null, false, { message: "Invalid email or password." });
        });
      }
    )
  );
app.listen(PORT, () => console.log("server started on port", PORT));