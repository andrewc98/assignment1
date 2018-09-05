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

require('./routes.js')(app, path);
require('./socket.js')(app, io);
require('./listen.js')(http);

var groups = require('./data/groups.json');
var channels = require('./data/channels.json');
var users = require('./data/users.json');

// --- App get for groups Start
app.get('/api/groups', (req, res) => {
    console.log("get.api/groups");
    fs.readFile('./data/groups.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            groupsJSON = JSON.parse(data);
            res.send(groupsJSON);
        }
    });
});
app.post('/api/groups', function (req, res) {
    let group_name = req.body.group_name;
    let existing_group = groups.find(x => x.group_name == group_name);

    if (existing_group == undefined) {
        let new_group = {"group_name": group_name, "users": []};
        groups.push(new_group);
        groupsJSON = JSON.stringify(groups);
        fs.writeFile('./data/groups.json', groupsJSON,'utf-8',function(err){
            if (err) throw err;
            res.send(groups);
        });
    }
});
app.put('/api/groups/:id', function (req, res) {
    console.log('Add Channel to Group');
    let channel_name = req.body[0];
    console.log(channel_name);
    let group_name = req.body[1].group_name;
    console.log(group_name);

    let channel_to_add = channels.find(x => x.channel_name == channel_name);
    console.log(channel_to_add);

    if (channel_to_add) {
        let group_to_add = groups.find(x => x.group_name == group_name);
        if (group_to_add.channels.indexOf(channel_name) == -1) {

            groups = groups.filter(x => x.group_name != group_name);
            group_to_add.channels.push(channel_name);

            groups.push(group_to_add);
            let new_groups = JSON.stringify(groups);
            fs.writeFile('./data/groups.json', new_groups,'utf-8',function(err){
                if (err) throw err;
                console.log(new_groups);
                res.send(new_groups);
            });
        }
    }
});
// --- App get for groups End

// --- App get for channels Start
app.get('/api/channels', (req, res) => {
    console.log("get.api/channels");
    fs.readFile('./data/channels.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            channelsJSON = JSON.parse(data);
            res.send(channelsJSON);
        }
    });
});
app.post('/api/channels', function (req, res) {
    let channel_name = req.body.channel_name;
    let existing_channel = channels.find(x => x.channel_name == channel_name);

    if (existing_channel == undefined) {
        let new_channel = {"channel_name": channel_name, "users": []};
        channels.push(new_channel);
        channelsJSON = JSON.stringify(channels);
        fs.writeFile('./data/channels.json', channelsJSON,'utf-8',function(err){
            if (err) throw err;
            res.send(channels);
        });
    }
});
app.put('/api/channels/:id', function (req, res) {
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
app.delete('/api/channels/:channel_name', function (req, res) {
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
    console.log("get.api/users");
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
app.post('/api/users', function (req, res) {
    console.log('New User');
    let user_name = req.body.name;
    let user_email = req.body.email;
    let existing_user = users.find(x => x.user_name == user_name);

    if (existing_user == undefined) {
        let new_user = {"user_name": user_name, "email": user_email, "access_level": 1};
        users.push(new_user);
        console.log(users);
        usersJSON = JSON.stringify(users);
        fs.writeFile('./data/users.json',usersJSON,'utf-8',function(err){
            if (err) throw err;
            res.send(users);
        });
    }
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

// --- App get for dashboard Start
app.get('/api/dash', (req, res) => {
    console.log("get.api/users");
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
// --- App get for dashboard End