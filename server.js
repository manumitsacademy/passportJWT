var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var User = require('./User')
var passport = require('passport');
var config = require('./database');
require('./passport')(passport);
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var TokenStrategy = require('passport-http-oauth').TokenStrategy;
var jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var session = require("express-session"),
bodyParser = require("body-parser");
app.use(express.static(__dirname+"/public"));
app.use(cors());

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', (req, res, next)=>{
  User.findOne({
    username: req.body.username,
    password:req.body.password
  }, function(err, user) {
    if (err) throw err;

    if (user) {
      var token = jwt.sign(user.toJSON(), config.secret);
      // return the information including token as JSON
      res.json({success: true, token: 'JWT ' + token});
    } else {
      res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
    }
  });
});

app.get("/",passport.authenticate('jwt', { session: false}),(req,res)=>{res.send("HELLO")});
app.get('/abc',passport.authenticate('jwt', { session: false }),(req,res)=>{res.json({'vartha':'nakenti'})});
app.get('/logout', function(req, res){
  req.logout();
  res.json({'message':'loggedout'});
});
app.listen(4000,()=>{console.log("Server listening on 4000")});