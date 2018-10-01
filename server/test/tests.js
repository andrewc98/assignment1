var assert = require('assert');
const express = require('express')
const app = express();

// --- Functions for testing


// User Tests
function addUserToChannelTest(user, channel) {
    channel.users.push(user.name);
    return channel
}
function removeUserFromChannelTest(user, channel) {
    channel.users.filter(x => x == user.name);
    return channel
}
// User Tests

// Channel Tests
function addChannelToGroup(channel, group) {
    group.channels.push(channel);
    return group
}
function removeChannelFromGroup(channel, group) {
    group.channels.filter(x => x == channel.name);
    return group
}
// Channel Tests

// Group Tests
function addUserToGroup(group, user) {
    group.user.push(user);
    return group
}
function removeUserFromGroup(group, user) {
    group.user.filter(x => x.name != user.name);
    return group
}
// Group Tests


// --- Functions for testing

// Testing functions
describe("User Tests", function() {
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if users can be added to channels
    */
    it("Successful Adding", function () {
        var user = { name: "Joe", password: "1234", email: "JoeB@hotmail.com" }
        var channel = { name: "Sport", users: [] }
        var expected_result = { name: 'Sport', users: [ 'Joe' ] }

        setTimeout(function() {
            assert.equal(addUserToChannelTest(user, channel).users, expected_result.users);
        }, 5000);

    });
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if users can be removed from channels
    */
    it("Successful Removing", function () {
        var user = { name: "Joe", password: "1234", email: "JoeB@hotmail.com" }
        var channel = { name: "Sport", users: [ 'Joe' ] }

        setTimeout(function() {
            assert.equal(removeUserFromChannelTest(user, channel).users, []);
        }, 5000);

    });
})
describe("Channel Tests", function(){
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if channels can be added to groups
    */
    it("Successful Adding", function () {

        var group = { name: 'Sport', channels: [], users: [ 'Joe' ] }
        var channel = { name: 'Tennis', users: [ 'Joe' ] }

        setTimeout(function() {
            assert.equal(addChannelToGroup(group, channel).channels, [ channel ]);
        }, 5000);

    });
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if channels can be removed from groups
    */
    it("Successful Removal", function () {

        var group = { name: 'Sport', channels: [], users: [ 'Joe' ] }
        var channel = { name: 'Tennis', users: [ 'Joe' ] }

        setTimeout(function() {
            assert.equal(removeChannelFromGroup(group, channel).channels, [ ]);
        }, 5000);

    });
});
describe("Group Tests", function(){
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if users can be added to groups
    */
    it("Successful Adding", function () {

        var user = { name: "Joe", password: "1234", email: "JoeB@hotmail.com" }
        var group = { name: 'Sport', channels: [], users: [ ] }

        setTimeout(function() {
            assert.equal(addUserToGroup(group, user).users, [ 'Joe' ]);
        }, 5000);

    });
    /*
        Author -------- Andrew Campbell
        Date ---------- 1/10/2018
        Description --- This test will check if users can be removed from groups
    */
    it("Successful Adding", function () {

        var user = { name: "Joe", password: "1234", email: "JoeB@hotmail.com" }
        var group = { name: 'Sport', channels: [], users: [ 'Joe' ] }

        setTimeout(function() {
            assert.equal(removeUserFromGroup(group, user).users, [ ]);
        }, 5000);

    });
});
// Testing functions