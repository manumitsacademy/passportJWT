var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var User = require('./User')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var TokenStrategy = require('passport-http-oauth').TokenStrategy;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var session = require("express-session"),
bodyParser = require("body-parser");
app.use(express.static(__dirname+"/public"));
app.use(cors());
passport.serializeUser(function(user,cb) {
    console.log("serialiZEr")
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    console.log("deserialiZEr")
    cb(null, obj);
  });

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({ 'username': username,'password':password }, function (err, user) {
            console.log("findoNe",user)
            if (err) { return done(err); }
            if (!user) {

              return done(null, false, { message: 'Incorrect user details.' });
            }
            return done(null, user);
        });        
    }
));
passport.use(new BasicStrategy(
    function(username, password, done) {
      User.findOne({ 'username': username,'password':password }, function (err, user) {
          console.log(user)
        if (err) { return done(err); }
        if (!user) { return done(null, false); }        
        return done(null, user);
      });
    }
));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', (req, res, next)=>{
    console.log(req.body)
    passport.authenticate('local', function(err, user, info) {
        console.log("user::",user)
      if (err) { return next(err); }
      if (!user) { return res.send("Error"); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  });

app.get("/",passport.authenticate('basic', { session: true }),(req,res)=>{res.send("HELLO")});
app.get('/abc',passport.authenticate('basic', { session: true }),(req,res)=>{res.send("Im ABC")});
app.listen(4000,()=>{console.log("Server listening on 4000")});