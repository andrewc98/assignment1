const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/mydb';

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

// --- App get for dashboard End
/*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function collects all of the content to be displayed for a user. Anything else is not displayed on the dashboard.
*/
app.get('/api/dash', (req, res) => {
    fs.readFile('./data/groups.json', 'utf8', function(err, data){
        if (err) {
            console.log(err);
        } else {
            groupsJSON = JSON.parse(data);
            var groups_to_return = [];
            groupsJSON.forEach(group => {
                var channels_user_in = [];
                group.channels.forEach(channel => {
                    if (channel.users && channel.users.indexOf(req.query.name) != -1) {
                        channels_user_in.push(channel);
                    }
                });
                if (group.users && (channels_user_in.length > 0 || group.users.indexOf(req.query.name)) != -1) {
                    groups_to_return.push({
                        group_name: group.group_name,
                        channels: channels_user_in
                    });
                }
            });
            res.send(groups_to_return);
        }
    });
});
// --- App get for dashboard End

// --- App get for groups Start
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function reads all of the groups from JSON and returns them.
*/
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
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function creates a new channel, if it does not already exist.
*/
app.post('/api/groups', function (req, res) {
    let group_name = req.body.group_name;
    let existing_group = groups.find(x => x.group_name == group_name);

    if (existing_group == undefined) {
        let new_group = {"group_name": group_name, "channels": [], "users": []};
        groups.push(new_group);
        groupsJSON = JSON.stringify(groups);
        fs.writeFile('./data/groups.json', groupsJSON,'utf-8',function(err){
            if (err) throw err;
            res.send(groups);
        });
    }
});
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function adds a channel to a group.
                --- Removes a channel from a group.
                --- Adds a user to a group.
*/
app.put('/api/groups/:id', function (req, res) {
    console.log('.put/api/groups/');
    let channel_user_name = req.body[0];
    let group_name = req.body[1].group_name;
    let type_name = req.body[2];

    if (type_name == 'channel') {
        let channel_to_add = channels.find(x => x.channel_name == channel_user_name);
        if (channel_to_add) {
            let group_to_add = groups.find(x => x.group_name == group_name);
            var good_to_add = true;

            if (group_to_add.channels) {
                for (let i = 0; i < group_to_add.channels.length; i++) {
                    if (group_to_add.channels[i].channel_name == channel_to_add.channel_name) {
                        group_to_add.channels.splice(i, 1);
                        good_to_add = false;
                    }
                }
            }
            if (good_to_add) {
                groups = groups.filter(x => x.group_name != group_name);
                group_to_add.channels.push(channel_to_add);
                groups.push({
                    group_name: group_to_add.group_name,
                    channels: group_to_add.channels,
                    users: group_to_add.users
                });
            }
        }
    } else if (type_name == 'user') {
        let user_to_add = users.find(x => x.user_name == channel_user_name);
        if (user_to_add) {
            let group_to_add = groups.find(x => x.group_name == group_name);
            console.log(group_to_add);
            if (!group_to_add.users || group_to_add.users.indexOf(channel_user_name) == -1) {    
                groups = groups.filter(x => x.group_name != group_name);
                group_to_add.users.push(channel_user_name);
                groups.push(group_to_add);
                let new_groups = JSON.stringify(groups);
                fs.writeFile('./data/groups.json', new_groups,'utf-8',function(err){
                    if (err) throw err;
                    res.send(new_groups);
                });
            }
        }
    }
    let new_groups = JSON.stringify(groups);
    fs.writeFile('./data/groups.json', new_groups,'utf-8',function(err){
        if (err) throw err;
        res.send(new_groups);
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function will delete a group.
*/
app.delete('/api/groups/:group_name', function (req, res) {
    console.log('Delete Group');
    let group_name = req.params.group_name;
    let del = groups.find(x => x.group_name == group_name);
    groups = groups.filter(x => x.group_name != group_name);    
    let new_groups = JSON.stringify(groups);
    fs.writeFile('./data/groups.json',new_groups,'utf-8',function(err){
        if (err) throw err;
        console.log(del);
        res.send(del);
    });
});
// --- App get for groups End

// --- App get for channels Start
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function collects all of the data from the channels.json file. Then returns it.
*/
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
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function creates a new empty channel.
*/
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
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function is used to add and remove a user from a channel.
*/
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
            groups.forEach(group => {
                group.channels.forEach(channel => {
                    console.log(channel_name + " " + channel.channel_name);
                    if (channel.channel_name == channel_name) {
                        channel.users.push(user_name);
                        new_groups = JSON.stringify(groups);
                        fs.writeFile('./data/groups.json', new_groups,'utf-8',function(err){
                            if (err) throw err;
                        });
                    }
                });
            });
        } else {
            channels.forEach(channel => {
                if (channel.channel_name == channel_name) {
                    let remove_index = channel.users.indexOf(user_name);
                    if (remove_index != -1) {
                        channel.users.splice(remove_index, 1);
                    }
                }
            });

            groups.forEach(group => {
                group.channels.forEach(channel => {
                    if (channel.channel_name == channel_name) {
                        let remove_index = channel.users.indexOf(user_name);
                        if (remove_index != -1) {
                            channel.users.splice(remove_index, 1);
                        }
                    }
                });
            });
        }
        let new_channels = JSON.stringify(channels);
        fs.writeFile('./data/channels.json', new_channels,'utf-8',function(err){
            if (err) throw err;
            res.send(new_channels);
        });
    }
});
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function is used to delete a channel, and all of it's connections it has to users/groups.
*/
app.delete('/api/channels/:channel_name', function (req, res) {
    console.log('Delete Channel');
    let channel_name = req.params.channel_name;
    let del = channels.find(x => x.channel_name == channel_name);
    channels = channels.filter(x => x.channel_name != channel_name);

    groups.forEach(group => {
        group.channels.forEach(channel => {
            if (channel.channel_name == channel_name) {
                let remove_index = group.channels.indexOf(channel);
                group.channels.splice(remove_index, 1);
            }
        });
    });
    
    let new_groups = JSON.stringify(groups);
    fs.writeFile('./data/groups.json',new_groups,'utf-8',function(err){
        if (err) throw err;
    });

    let new_channels = JSON.stringify(channels);
    fs.writeFile('./data/channels.json',new_channels,'utf-8',function(err){
        if (err) throw err;
        console.log(del);
        res.send(del);
    });
});
// --- App get for channels End

// --- App get for users Start
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function will get all of the users from the user.json file.
*/
app.get('/api/users', (req, res) => {
    console.log("get.api/users");

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var users = db.db(dbName);
    
        // Drop & Create users
        users.createCollection("users", function(err, res) {
            if (err) { return console.log(err) }
            console.log("Created");
        });
        // Drop & Create users

        // Delete & Add the super user
        const super_user = {name: 'super', email: "supersuzie@gmail.com", access_level: 3 };
        users.collection("users").deleteOne(super_user, function(err, obj) {
            if (err) { return console.log(err) }
            console.log("Deleted: " + super_user.name);
        });
        users.collection("users").insertOne(super_user, function(err, obj) {
            if (err) { return console.log(err) }
            console.log("Inserted: " + super_user.name);
        });
        // Delete & Add the super user

        // Find users
        users.collection("users").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find users

        db.close();
    });
});

/*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function will promote or demote a user, depending on the input recieved.
*/
app.put('/api/users/:user_name', function (req, res) {
    console.log('Change Access Level');
    let user_name = req.body[0].user_name;
    let access_level = req.body[1];

    let user_to_add = users.find(x => x.user_name == user_name);

    if (user_to_add) {
        if (access_level == '+') {
            if (user_to_add.access_level == '1') { user_to_add.access_level = '2' }
            else if (user_to_add.access_level = '1') { user_to_add.access_level = '3' }
        } else if (access_level == '-') {
            if (user_to_add.access_level == '3') { user_to_add.access_level = '2' }
            else if (user_to_add.access_level = '2') { user_to_add.access_level = '1' }
        }

        console.log(user_to_add);

        users = users.filter(x => x.user_name != user_name);
        users.push(user_to_add);
        let new_users = JSON.stringify(users);
        fs.writeFile('./data/users.json', new_users,'utf-8',function(err){
            if (err) throw err;
            res.send(new_users);
        });
    }
});
/*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function is used to create a new user.
*/
app.post('/api/users', function (req, res) {
    console.log('New User');
    let user_name = req.body.name;
    let user_email = req.body.email;

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var users = db.db(dbName);

        // Delete & Add the super user
        const new_user = {name: user_name, email: user_email, access_level: 1 };
        // Define the user
        
        var exists = false;

        // Check if the user already exists
        users.collection("users").find({name: user_name}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            if (result) { exists = true; }
        });
        // Check if the user already exists

        // Add the user to the DB
        if (exists == false) {
            users.collection("users").insertOne(new_user, function(err, obj) {
                if (err) { return console.log(err) }
                console.log("Inserted: " + new_user.name);
            });
        }
        // Add the user to the DB

        // Find users
        users.collection("users").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find users

        db.close();
    });

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

/*
  Author ------- Andrew Campbell
  Date --------- 02/09/2018
  Description -- This function will delete a new user based on the input of the form.
*/
app.delete('/api/users/:user_name', function (req, res) {
    console.log('Delete user');
    let user_name = req.params.user_name;
    console.log(user_name);

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var users = db.db(dbName);

        // Add the user to the DB
        users.collection("users").deleteOne({name: user_name}, function(err, obj) {
            if (err) { return console.log(err) }
            console.log("Deleted: " + user_name);
        });
        // Add the user to the DB

        // Find users
        users.collection("users").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find users

        db.close();
    });
});
// --- App get for users End