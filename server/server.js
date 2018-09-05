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

var groupsJSON = [];
var channelsJSON = [];
var usersJSON = [];

// --- App get for groups Start
app.get('/api/groups', (req, res) => {
    fs.readFile('./data/groups.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            groupsJSON = JSON.parse(data);
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
            channelsJSON = JSON.parse(data);
            res.send(channelsJSON);
        }
    });
});
app.post('/api/channel/', function (req, res) {
    console.log('New Channel');
    let channel_name = req.params.channel_name;
    let new_channel = {"channel_name": channel_name, "users": []};
    console.log(new_channel);

    let channel_to_add = channels.find(x => x.channel_name == channel_name);
    if (channel_to_add) {
        if (channel_to_add.users.indexOf(user_to_add.user_name) == -1) {
            channels.push(new_channel);
            fs.writeFile('./data/channels.json', channels,'utf-8',function(err){
                if (err) throw err;
                channelsJSON = JSON.parse(channels);
                res.send(channelsJSON);
            });;
        }
    }
});
app.put('/api/channel/:id', function (req, res) {
    console.log('Add User to Channel');
    let user_name = req.body[0];
    let channel_name = req.body[1].channel_name;

    let user_to_add = users.find(x => x.user_name == user_name);

    if (user_to_add) {
        let channel_to_add = channels.find(x => x.channel_name == channel_name);
        if (channel_to_add.users.indexOf(user_to_add.user_name) == -1) {
            channels = channels.filter(x => x.channel_name != channel_name);
            channel_to_add.users.push(user_name);
            channels.push(channel_to_add);
            let new_channels = JSON.stringify(channels);
            fs.writeFile('./data/channels.json', new_channels,'utf-8',function(err){
                if (err) throw err;
                console.log(new_channels);
                res.send(new_channels);
            });
        }
    }
});
app.delete('/api/channel/:channel_name', function (req, res) {
    console.log('Delete Channel');
    let channel_name = req.params.channel_name;
    let del = channels.find(x => x.channel_name == channel_name);
    channels = channels.filter(x => x.channel_name != channel_name);
    let new_channels = JSON.stringify(channels);
    fs.writeFile('./data/channels.json',new_channels,'utf-8',function(err){
        if (err) throw err;
        console.log(del);
        res.send(del);
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