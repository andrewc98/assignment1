const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));


// --- Allow connection to the angular app Start
app.use(express.static(path.join(__dirname, '../chat-app/dist/chat-app/')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});
app.get('/manage_groups', function(req,res){
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});
app.get('/manage_channels', function(req,res){
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});
app.get('/manage_users', function(req,res){
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});
// --- Allow connection to the angular app End

var groups = [];
var channels = [];
var usersJSON = [];

// --- App get for groups Start
app.get('/api/groups', (req, res) => {
    fs.readFile('./data/groups.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            var groupsJSON = JSON.parse(data);
            res.send(groupsJSON);
        }
    });
});
// --- App get for groups End

// --- App get for channels Start
app.get('/api/channels', (req, res) => {
    fs.readFile('./data/channels.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            var channelsJSON = JSON.parse(data);
            res.send(channelsJSON);
        }
    });
});
// --- App get for channels End

// --- App get for users Start
app.get('/api/users', (req, res) => {
    fs.readFile('./data/users.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            if (data) {
                usersJSON = JSON.parse(data);
                res.send(usersJSON);
            }
        }
    });
});
app.delete('/api/users/:user_name', function (req, res) {
    console.log('delete users');
    let user_name = req.params.user_name;
    let del = users.find(x => x.user_name == user_name);
    users = users.filter(x => x.user_name != user_name);
    let new_users = JSON.stringify(users);
    fs.writeFile('./data/users.json',new_users,'utf-8',function(err){
        if (err) throw err;
        console.log(del);
        res.send(del);
    });
});
// --- App get for users End

require('./routes.js')(app, path);
require('./socket.js')(app, io);
require('./listen.js')(http);

var groups = require('./data/groups.json');
var channels = require('./data/channels.json');
var users = require('./data/users.json');