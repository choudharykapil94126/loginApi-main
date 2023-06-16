const express = require('express'),
    app=express(),
    mongoose=require('mongoose'),
    session = require('express-session'),
    passport =require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user-db');

    require('dotenv').config();

    let username = process.env.USER;
    let password = process.env.PASS;

    mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.i6kh20t.mongodb.net/`).then(()=>{
    console.log("connected");
}).catch((error)=>{
    console.log("error while connecting",error);
});


//create session

app.use(session({
    secret:'SuperSecretPasswordForLogIn',
    resave:false,
    saveUninitialized:true,
    cookie:{
        //secure:true //use it when deployed only comment out this and comment in httponly
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24
        //expires:Date.now()+1000 * 60 * 60 * 24;
    }
}))

//passport work start
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());










app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

const user = require('./route/auth');

app.use(user);

app.get('/',(req,res)=>{
    res.render('home');
})

let PORT = 3000 || process.env.PORT;

app.listen(PORT,()=>{
    console.log("server run");
})
