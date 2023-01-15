
//jshint esversion:6
require('dotenv').config()

const express= require('express');
const app = express();
const bodyParser= require('body-parser');

const ejs = require("ejs");
const mongoose =require("mongoose");
const encrypt =require("mongoose-encryption");

const port=3000;

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{ useNewUrlParser: true }, function (err) { 
    if (err) throw err; console.log('Successfully connected'); });

const userSchema = new mongoose.Schema( {
    email: String,
    password: String
});

////////////the encryption 

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"]});


const User =mongoose.model("User",userSchema);

app.get('/',function(req,res){
    res.render("home");
});

app.get('/login',function(req,res){
    res.render("login");
});

app.get('/register',function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    newUser = new User({
        email:req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password =req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if (err){
            console.log(err);
        }else{
            if (foundUser){
                if (foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});


app.listen(process.env.PORT || port,function(){
    console.log('server running on '+port);
});


