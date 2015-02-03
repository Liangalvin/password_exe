var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));

var secret = require('./secret.json');

app.get("/", function(req,res){
  res.sendFile(__dirname + '/public/index.html');
});

// var secret = "penguin";

app.get("/login", function(req, res){
  if(req.query.password === secret['password']){
    res.redirect('/secret_page')
  }
  else{
    res.redirect('/')
  };
});

app.get('/secret_page', function(req,res){
  res.sendFile(__dirname + '/public/secret.html')
});

app.listen(3000);
console.log("listening on port 3000");
