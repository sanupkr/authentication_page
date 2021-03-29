require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/logindb",{useNewUrlParser:true,useUnifiedTopology:true});

const app = express();


app.use(body_parser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));


app.listen(3000,function(err){
  if(!err)
  {
    console.log("successfully running at port 3000");
  }
});


const login_schema = new mongoose.Schema({
  username:{type:String,unique:true},
  email:{type:String,required:true},
  password:{type:String,required:true}
});


login_schema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const Login = mongoose.model("Login",login_schema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/login",function(req,res){
  Login.findOne({email:req.body.email},function(err,user){
    if(!err)
    {
      if(user){
        if(user.password===req.body.password && user.username===req.body.username)
        {
          res.render("secrets",{name:user.username});
        }
        else{
          res.render("home");
        }
      }
      else{
        res.render("failure");
      }

    }

  });
});

app.post("/register",function(req,res){
  const user = new Login({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password
  });

  user.save(function(err){
    if(!err)
    {

      res.render("secrets",{name:user.username});
    }
    else{
      console.log(err);
    }

  });
});
