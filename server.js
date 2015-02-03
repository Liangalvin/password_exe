var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var secret = require('./secret.json');
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database("authentic.db");
// db.run("INSERT INTO users (username, password) VALUES(?, ?)", username, password, function(err){
//   if(err){
//     throw err;
//   }
// });
// db.run("SELECT * FROM users WHERE username = ? and pasword = ?", username, password, function(err, row){
//   if(err){
//     throw err;
//   }
//   if(row){
//     redirect('/')
//   }
//   else{
//     redirect('/')
//   }
// });

app.use(session({
  secret: secret.password,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", function(req,res){
  res.sendFile(__dirname + '/public/index.html');
});

//var secret = "penguin";

app.post('/user', function(req, res){
  var confirm = req.body.confirm;
  user = {
  'username': req.body.username,
  'password': req.body.password
  }
  console.log(user);

  db.run("INSERT INTO users (username, password) VALUES(?, ?)", user.username, user.password, function(err){
    if(err){
      throw err;
    }
  });


  if(user.password === confirm){
    req.session.valid_user = true;
    res.redirect('/secret_page');
  }
  else{
    res.redirect('/')
  }
});

app.post('/session', function(req, res){

  db.get("SELECT * FROM users WHERE username = ? and password = ?", req.body.username, req.body.password, function(err, row){
    if(err){
      throw err;
    }
    if(row){
      req.session.valid_user = true;
      res.redirect('/secret_page')
    }
    else{
      res.redirect('/')
    }
  });
})

// app.get("/login", function(req, res){
//   if(req.query.password === secret['password']){
//
//     res.redirect('/secret_page')
//   }
//   else{
//     res.redirect('/')
//   };
// });

app.get('/secret_page', function(req,res){
  if(req.session.valid_user === true){
    res.sendFile(__dirname + '/public/secret.html')
  }
  else{
    res.redirect('/');
  }
});

app.listen(3000);
console.log("listening on port 3000");
