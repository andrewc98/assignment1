## Git
The git repository maintains the same structure as was seen in assignment 1, just the singular master branch. Unlike last time, no attempts at branching were made, which resulted in not encountering any branching issues. A straight forward singular branch ensured that when I did encounter a problem, I was able to reverse back to before the problem was created. This form of version control has worked successfully in the previous assessment, and continued to in this current one. Furthermore, this assignment was completed by me alone, so there was less of a need to implement branches.

## Data Structures
#### User
```js
{
    name: "Andrew",
    password: "123456789",
    access_level: 1,
    email: "me@hotmail.com"
}
```
This is an example of the structure of one of my user objects. It should also be noted that there is also an attribute of "_id" for all objects, but that is automatically created by MongoDB and is not used in this project. The user object holds four attributes, name, password, access_level, and email. To login, a person must input a matching set of "username" and "password". The "access_level" denotes what permissions the user has been given. With 1 being a normal user, 2 is a group admin, and 3 is a super admin.

#### Channel
```js
{
    name: "Tennis",
    users: [ "Roger", "Novak", "Rafael" ]
}
```
This type of data structure is used to store channels. The name of the channel is stored in the "name" attribute. The users had only their name stored in an array in the "users" attribute.

#### Group
```js
{
    name: "Sport",
    channels: [ { name: "Tennis", users: [ "Roger", "Novak", "Rafael" ] }, { name: "Rubgy League", users: [ "Johnathan", "Billy", "Ben" ] } ],
    users: [ "Roger", "Novak", "Rafael", "Johnathan", "Billy", "Ben" ]
}
```
Groups has a more detailed way of storing data. The name of the group and the users added to it are stored in "name" and "users", respectively, but "channels" stores an instance of a channel. Doing it this way makes it a little more difficult to perform actions on channels, because there are two places they're stored, but it ultimately works out.

#### Chat
```js
{
    name: "Tennis",
    messages: ["Andrew joined the chat", "[Andrew] Hello World", "Andrew left the chat"]
}
```
Each record in chat stores the name of the channel that the chat appears in, and the messages are held in an array under the "messages" attribute. Messages are appended in order of arrival, so it's guaranteed that the messages will always be in the correct order.


## REST API
#### Get
The REST API is utilised by HttpClient and the routes it provides. The first route used was "Get". Get is typically used to initially retrieve the content from the Database. Most Get calls are made when the user first visits the page, where it will perform a route of "http://localhost:3000/api/[Table]", where "[Table]" denotes the MongoDB table I want to retrieve data from. Upon hitting that route, the Node server will scan the database and return all of the records. The exception to this is the dashboard, which will decide which tables to return, depending on the permissions of the user.

#### Post
Post is used to insert new records. Post takes a similar route to Get, but also needs parameters.
```typescript
return this.http.post('http://localhost:3000/api/[Table]/', data, httpOptions);
```
Data indicates the content that Node will need, in order to add a record to the database.
```typescript
app.put('/api/groups/:id', function (req, res) {
    let data = req.params.data;
    //Retrieve content
    res.send(data)
});
```
This snippet of code omits a lot of detail, but it is the structure of what is performed on the node side. Node will call the MongoDB database and insert a record, then return the new array of records. As in all tables, if the record the user wishes to insert already exists, it will not be added.

#### Put
Put is very similar to Post, but instead of inserting a whole new record, an existing one is altered.
```ts
return this.http.put('http://localhost:3000/api/[Table]/' + data, body, httpOptions);
```
The above line of code is very similar to post, but it has an extension on the end of the route. This extension is used to identify what record needs modification. Body will contain the content that the user wishes to update to. The original record is obtained through the data variable. Lastly, deleting.

#### Delete
Delete is prompted similarly to Put:
```ts
return this.http.delete('http://localhost:3000/api/[Table]/' + name);
```
Delete will find the record to delete, and remove it from the MongoDB. Delete will also return a new set of records, which is the same records as before, without the removed record.

## Angular Architecture
The angular architecture remains largely the same as the first assignment with Components and Services performing most of the functionality. All services are performing essentially the same thing, calling the Node server. Such as:
```ts
return this.http.delete('http://localhost:3000/api/[Table]/' + name);
```
Upon reaching a service, the data will already be formatted and ready to reach the node server. All of the manipulation of the data is performed in the component. This is done to prevent unnecessarily large data from being sent through the server. The model is stored in MongoDB, under four different tables, "groups", "channels", "users", and "chat".

## Tests
1. Open a new terminal.
2. Navigate to the folder "./server/".
3. Run "npm test" in the terminal.
4. Done!