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

var result = null;
var success = false;

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

require('./routes.js')(app, path);
io.on('connection', (socket)=>{
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('add-message', (message, channel)=>{

        io.emit('message', {type:'message', text: [message, channel]});

        MongoClient.connect(url, {poolSize:10}, function(err, db) {
            if (err) { return console.log(err) }
            const dbName = 'mydb';
            var database = db.db(dbName);

            database.collection("chat").updateOne( { name: channel }, { $push: { messages: message } }, { upsert: true }, function(err, result) {
                console.log("Add a message to chat db");
                if (err) { return console.log(err) }
            });

            let items = database.collection("chat").find({});
            console.log(items[0]);
        });
    });
});
require('./listen.js')(http);

// --- App get for dashboard End
/*
    Author -------- Andrew Campbell
    Date ---------- 01/10/2018
    Description --- This function collects all of the content to be displayed for a user. Anything else is not displayed on the dashboard.
*/
app.get('/api/dash', (req, res) => {
    console.log("/api/dash");
    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }    
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Find users
        database.collection("groups").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            if (req.query.access_level == 3) {
                res.send(result);
            } else {
                returnGroups(result);
            }
        });
        function returnGroups(groups) {
            var groups_to_return = [];
            groups.forEach(group => {
                var channels_user_in = [];
                group.channels.forEach(channel => {
                    if (channel.users && channel.users.indexOf(req.query.name) != -1) {
                        channels_user_in.push(channel);
                    }
                });
                if (group.users && (channels_user_in.length > 0 || group.users.indexOf(req.query.name)) != -1) {
                    console.log(group.name);
                    groups_to_return.push({
                        name: group.name,
                        channels: channels_user_in
                    });
                }
            });
            res.send(groups_to_return);
        }
        // Find users
    });
});
// --- App get for dashboard End

// --- App get for groups Start
/*
    Author -------- Andrew Campbell
    Date ---------- 30/09/2018
    Description --- This function reads all of the groups from JSON and returns them.
*/
app.get('/api/groups', (req, res) => {
    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }    
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Find users
        database.collection("groups").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find users
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function creates a new group, if it does not already exist.
*/
app.post('/api/groups', function (req, res) {

    let group_name = req.body.group_name;

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }    
        const dbName = 'mydb';
        var database = db.db(dbName);

        database.collection("groups").findOne({name: group_name}, function(err, result) {
            if (err) { return console.log(err) }
            console.log("");
            if (result === null) {
                addGroup();
            } else {
                db.close();
            }
        });

        // Add the user to the DB
        function addGroup() {
            console.log("Add Group");
            database.collection("groups").insertOne({name: group_name, channels: [], users: [], admin: [] }, function(err, result) {
                console.log("Adding Group");
                if (err) { return console.log(err) }
                res.send(result);
                db.close();
            });
        }
    });
    // Add the user to the DB

});
/*
    Author -------- Andrew Campbell
    Date ---------- 30/09/2018
    Description --- This function adds a channel to a group.
                --- Removes a channel from a group.
                --- Adds a user to a group.
*/
app.put('/api/groups/:id', function (req, res) {
    console.log('.put/api/groups/');
    let channel_user_name = req.body[0];
    let group_name = req.body[1].name;
    let type_name = req.body[2]; //channel, user

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        database.collection("groups").findOne({name: group_name}, function(err, result) {
            console.log('Find Group');
            console.log(result);
            if (err) { return console.log(err) }
            if (result !== null) {
                if (type_name == "channels") {
                    findChannel(result);
                } else {
                    addUserToGroup(result);
                }
            } else {
                db.close();
            }
        });

        function addUserToGroup(group) {
            console.log("addChannelToGroup");
            if (group.users.find(x => x == channel_user_name) === undefined) {
                console.log("Here!");
                // Find users
                if (type_name == 'admin') {
                    console.log(type_name);
                    var new_admin = group.admin;
                    new_admin.push(channel_user_name)
                    database.collection("groups").updateOne({ name: group.name }, { $set: {admin: new_admin} }, function(err, result) {
                        if (err) { return console.log(err) }
                        database.collection("users").updateOne({ name: channel_user_name, access_level: 1 }, { $set: {access_level: 2} }, function(err, result) {
                            if (err) { return console.log(err) }
                        });
                    });
                }
                var new_users = group.users;
                new_users.push(channel_user_name);
                database.collection("groups").updateOne({ name: group.name }, { $set: {users: new_users} }, function(err, result) {
                    if (err) { return console.log(err) }
                    returnGroups();
                });
                // Find users
            }
        }

        function findChannel(group) {
            console.log('findChannel');
            database.collection("channels").findOne({name: channel_user_name}, function(err, result) {
                if (err) { return console.log(err) }
                if (result !== null) {
                    addChannelToGroup(result, group)
                } else {
                    db.close();
                    console.log("Couldn't find channel");
                }
            });
        }

        function addChannelToGroup(channel, group) {
            console.log("addChannelToGroup");
            if (group.channels.find(x => x.name == channel.name) === undefined) {
                var new_channels = group.channels;
                new_channels.push(channel);
                database.collection("groups").updateOne({ name: group.name }, { $set: {channels: new_channels} }, function(err, result) {
                    if (err) { return console.log(err) }
                    returnGroups();
                });
            } else {
                var new_channels = group.channels.filter(x => x.name !== channel_user_name);
                console.log(new_channels);
                console.log(channel_user_name);
                database.collection("groups").updateOne({ name: group.name }, { $set: {channels: new_channels} }, function(err, result) {
                    if (err) { return console.log(err) }
                    returnGroups();
                });
            }
        }

        function returnGroups() {
            console.log('returnGroups');
            database.collection("groups").find({}).toArray(function(err, result) {
                if (err) { return console.log(err) }
                res.send(result);
                db.close();
            });
        }
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function will delete a group.
*/
app.delete('/api/groups/:group_name', function (req, res) {
    console.log('Delete Group');
    let group_name = req.params.group_name;

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Delete group from the DB
        database.collection("groups").deleteOne({name: group_name}, function(err, obj) {
            if (err) { return console.log(err) }
            console.log("Deleted: " + group_name);
        });
        // Delete group from the DB

        // Find groups
        database.collection("groups").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find groups

        db.close();
    });
});
// --- App get for groups End

// --- App get for channels Start
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function collects all of the data from the MongoDB channels collection. Then returns it.
*/
app.get('/api/channels', (req, res) => {
    console.log("get.api/channels");

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }    
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Find users
        database.collection("channels").find({}).toArray(function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            res.send(result);
        });
        // Find users
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function creates a new empty channel.
*/
app.post('/api/channels', function (req, res) {
    let channel_name = req.body.channel_name;
    
    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        let new_channel = { name: channel_name, users: [] }

        database.collection("channels").findOne({name: channel_name}, function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            if (result === null) {
                addChannel(new_channel);
            } else {
                db.close();
            }
        });

        // Add the user to the DB
        function addChannel(new_channel) {
            console.log("Add Channel");
            database.collection("channels").insertOne(new_channel, function(err, result) {
                console.log("Adding Channel");
                if (err) { return console.log(err) }
                res.send(result);
                db.close();
            });
        }
        // Add the user to the DB
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 01/10/2018
    Description --- This function is used to add and remove a user from a channel.
*/
app.put('/api/channels/:id', function (req, res) {
    console.log('Add User to Channel');
    let user_name = req.body[0];
    let channel_name = req.body[1].name;
    console.log(user_name);
    console.log(channel_name);

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        database.collection("channels").findOne({name: channel_name}, function(err, result) {
            if (err) { return console.log(err) }
            if (result !== null) {
                findUser(result);
            } else {
                db.close();
            }
        });
        
        function findUser(channel) {
            database.collection("users").findOne({name: user_name}, function(err, result) {
                if (err) { return console.log(err) }
                if (result !== null) {
                    addUserToChannel(result, channel)
                } else {
                    db.close();
                }
            });
        }

        function addUserToChannel(user, channel) {
            console.log("addUserToChannel");
            if (channel.users.find(x => x.name == user.name) === undefined) {
                console.log(channel);
                // Find users
                channel.users = channel.users.filter(x => x != user.name);
                channel.users.push(user.name);
                database.collection("channels").findOneAndUpdate({ name: channel.name }, { $set: {users: channel.users} }, function(err, result) {
                    if (err) { return console.log(err) }
                    console.log(result + " This line");
                    addUserToGroupChannel(channel);
                });
                // Find users
            }
        }

        function addUserToGroupChannel(channel) {
            console.log("addUserToGroupChannel");
            database.collection("groups").find({}, function(err, results) {
                results.forEach(group => {
                    if (group.channels != group.channels.filter(x => x.name != channel.name)) {

                        var new_group_channels = group.channels.filter(x => x.name != channel.name);
                        new_group_channels.push(channel);

                        database.collection("groups").updateOne({ name: group.name }, { $set: {channels: new_group_channels} }, function(err, result) {
                            if (err) { return console.log(err) }
                        });
                    }
                });
                returnChannels()
            });
        }

        function returnChannels() {
            database.collection("channels").find({}).toArray(function(err, result) {
                if (err) { return console.log(err) }
                console.log(result);
                res.send(result);
                db.close();
            });
        }
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 01/10/2018
    Description --- This function is used to delete a channel, and all of it's connections it has to users/groups.
*/
app.delete('/api/channels/:channel_name', function (req, res) {
    console.log('Delete Channel');
    let channel_name = req.params.channel_name;

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Delete a channel
        database.collection("channels").deleteOne({name: channel_name}, function(err, results) {
            if (err) { return console.log(err) }
            console.log("Deleted: " + channel_name);
            res.send(results);
        });
        // Delete a channel

        // Delete a channel
        database.collection("groups").find({}, function(err, results) {
            if (err) { return console.log(err) }
            results.forEach(group => {
                deleteChannelFromGroup(group);
            });
        });
        function deleteChannelFromGroup(group) {
            group.channels.forEach(channel => {
                if (channel.name == channel_name) {
                    database.collection("groups").updateOne({name: group.name}, {$pull: { channels: channel } }, function(err, results) {
                        if (err) { return console.log(err) }
                    });
                }
            });
        }
        // Delete a channel
    });
});
// --- App get for channels End

// --- App get for users Start
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function will get all of the users from the MongoDB users collection.
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
        const super_user = {name: 'super', password: "12345", email: "supersuzie@gmail.com", access_level: 3 };
        users.collection("users").deleteMany({name: super_user.name}, function(err, obj) {
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
            res.send(result);
        });
        // Find users

        db.close();
    });
});

/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function will promote or demote a user, depending on the input recieved.
*/
app.put('/api/users/:user_name', function (req, res) {
    console.log('Change Access Level');
    let user_name = req.body[0].name;
    let accessLevel = req.body[1];
    let currAccessLevel = req.body[0].access_level;

    var updated_level;
    if (currAccessLevel == 1 && accessLevel == "+") { updated_level = 2 }
    else if (currAccessLevel == 2 && accessLevel == "+") { updated_level = 3 }
    else if (currAccessLevel == 3 && accessLevel == "-") { updated_level = 2 }
    else { updated_level = 1 }

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Find users
        database.collection("users").updateOne({ name: user_name }, { $set: {access_level: updated_level} }, function(err, result) {
            if (err) { return console.log(err) }
            res.send(result);
        });
        // Find users
    });
});
/*
    Author -------- Andrew Campbell
    Date ---------- 29/09/2018
    Description --- This function is used to create a new user.
*/
app.post('/api/users', function (req, res) {
    console.log('New User');
    let user_name = req.body.name;
    let user_email = req.body.email;
    let user_pass = req.body.password;

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var users = db.db(dbName);

        // Delete & Add the super user
        const new_user = {name: user_name, password: user_pass, email: user_email, access_level: 1 };
        // Define the user

        users.collection("users").findOne({name: user_name}, function(err, result) {
            if (err) { return console.log(err) }
            console.log(result);
            if (result === null) {
                addUser(new_user);
            } else {
                db.close();
            }
        });

        // Add the user to the DB
        function addUser(new_user) {
            console.log("Add User");
            users.collection("users").insertOne(new_user, function(err, result) {
                console.log("Adding User");
                if (err) { return console.log(err) }
                res.send(result);
                db.close();
            });
        }
        // Add the user to the DB
    });
});

/*
  Author ------- Andrew Campbell
  Date --------- 30/09/2018
  Description -- This function will delete a new user based on the input of the form.
*/
app.delete('/api/users/:user_name', function (req, res) {
    console.log('Delete user');
    let user_name = req.params.user_name;
    console.log(user_name);

    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        // Add the user to the DB
        database.collection("users").deleteOne({name: user_name}, function(err, obj) {
            if (err) { return console.log(err) }
            deleteUserFromChannel();
            deleteUserFromGroup();
            returnUsers();
            console.log("Deleted: " + user_name);
        });
        // Add the user to the DB

        //Remove user from channels
        function deleteUserFromChannel() {
            database.collection("channels").find({}).toArray(function(err, result) {
                if (err) { return console.log(err) }
                result.forEach(element => {
                    removeUserFromChannel(element);
                });
            });
            function removeUserFromChannel(channel) {
                let new_users = channel.users.filter(x => x != user_name)
                console.log("removeUserFromChannel");
                console.log(new_users);
                database.collection("channels").updateOne({ name: channel.name }, { $set: {users: new_users} }, function(err, result) {
                    if (err) { return console.log(err) }
                });
            }
        }
        //Remove user from channels

        //Remove user from channels
        function deleteUserFromGroup() {
            database.collection("groups").find({}).toArray(function(err, result) {
                if (err) { return console.log(err) }
                result.forEach(element => {
                    removeUserFromGroup(element);
                });
            });
            function removeUserFromGroup(group) {
                let new_users = group.users.filter(x => x != user_name)
                database.collection("groups").updateOne({ name: group.name }, { $set: {users: new_users} }, function(err, result) {
                    if (err) { return console.log(err) }
                    group.channels.forEach(channel => {
                        removeUserFromGroupChannel(group, channel);
                    });
                });
            }
            function removeUserFromGroupChannel(group, channel) {
                var channel_to_add = channel;
                var new_users = channel.users.filter(x => x != user_name);
                channel_to_add.users = new_users;
                var new_channels = group.channels.filter(x => x != channel);
                new_channels.push(channel_to_add);
                database.collection("groups").updateOne({ name: group.name }, { $set: {channels: new_channels} }, function(err, result) {
                    if (err) { return console.log(err) }
                });
            }
        }
        //Remove user from channels

        // Find users
        function returnUsers() {
            database.collection("users").find({}).toArray(function(err, result) {
                if (err) { return console.log(err) }
                console.log(result);
                res.send(result);
            });
        }
        // Find users

    });
});
// --- App get for users End


// --- App get for chat
/*
  Author ------- Andrew Campbell
  Date --------- 30/09/2018
  Description -- This function will find the chat history from the MongoDB chat collection.
*/
app.get('/api/chat', (req, res) => {
    console.log("/api/chat");
    MongoClient.connect(url, {poolSize:10}, function(err, db) {
        let channel_name = req.query.name;
        if (err) { return console.log(err) }
        const dbName = 'mydb';
        var database = db.db(dbName);

        console.log("Chat.js " + channel_name);

        // Find users
        database.collection("chat").findOne({name: channel_name}, function(err, result) {
            if (err) { return console.log(err) }
            console.log("Added Message");
            res.send(result);
        });
        // Find users
    });
});
// --- App get for chat