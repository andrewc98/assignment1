## Git
The git repository maintains the same structure as was seen in assignment 1, just the singular master branch. Unlike last time, no attempts at branching were made, which resulted in not encountering any branching issues. A straight forward singular branch ensured that when I did encounter a problem, I was able to reverse back to before the problem was created. This form of version control has worked successfully in the previous assessment, and continued to in this current one. Furthermore, this assignment was completed by me alone, so there was less of a need to implement branches.

## Data Structures
#### User
```javascript
{
    name: "Andrew",
    password: "123456789",
    access_level: 1,
    email: "me@hotmail.com"
}
```
This is an example of the structure of one of my user objects. It should also be noted that there is also an attribute of "_id" for all objects, but that is automatically created by MongoDB and is not used in this project. The user object holds four attributes, name, password, and email. To login, a person my input a matching set of "name" and "username". The "access_level" denotes what permissions the user has been given. With 1 being a normal user, 2 is a group admin, and 3 is a super admin.

#### Channel
```javascript
{
    name: "Tennis",
    users: [ "Roger", "Novak", "Rafael" ]
}
```
This type of data stucture is used to store channels. The name of the channel is stored in the "name" attribute. The users had only their name stored in an array in the "users" attribute.

#### Group
```javascript
{
    name: "Sport",
    channels: [ { name: "Tennis", users: [ "Roger", "Novak", "Rafael" ] }, { name: "Rubgy League", users: [ "Johnathan", "Billy", "Ben" ] } ],
    users: [ "Roger", "Novak", "Rafael", "Johnathan", "Billy", "Ben" ]
}
```
Groups has a more detailed way of storing data. The name of the group and the users added to it are stored in "name" and "users", repspectively, but channels stores an instance of a channel. Doing it this way makes it difficult to perform actions on channels, because there are two places to store it, but it ultimately works out.

#### Chat
```javascript
{
    name: "Tennis",
    messages: ["Andrew joined the chat", "[Andrew] Hi and Bye", "Andrew left the chat"]
}
```
Each record in chat stores the name of the channel the chat appears in, and the messages are held in an array under the "messages" attribute. Messages are appended in order of arrival, so it's guarentee that the messages will always be in the correct order.


## REST API
#### Get
The REST API is utalised by HttpClient and the routes it provides. The first route used was "Get". Get is typically used to initialy retrieve the content from the Database. Most Get calls are made when the user first visits the page, where it will perform a route of "http://localhost:3000/api/[Table]", where "[Table]" denotes the MongoDB table I want to retieve data from. Upon hitting that route, the Node server will scan the database and return all of the records. The exception to this is the dashboard, which will deciede which tables to return, depending on the permissions of the user.

#### Post
Post is used to insert new records. Post takes a similar route to Get, but also needs parameters.
```typescript
return this.http.post('http://localhost:3000/api/[Table]/', data, httpOptions);
```
Data indicates the content that Node will need to add a record to the database.
```typescript
app.put('/api/groups/:id', function (req, res) {
    let data = req.params.data;
    //Retireve content
    res.send(data)
});
```
This snippet of code ommits a lot of detail, but it is the stucture of what is performed on the node side. Node will call the MongoDB database and insert a record, then return the new array of records. As in all tables, if the record the user wishes to insert alread exists, it will not be added.

#### Put
Put is very similar to Post, but instead of inserting a whole new record, an existing one is altered.
```ts
return this.http.put('http://localhost:3000/api/[Table]/' + data, body, httpOptions);
```
The above line of code is very similar to post, but it has an extension on the end of the route. This extension is used to identify what record needs modification. Body will contain the content that the user wishes to update to. The original record is obtained through the data variable. Lastly, deleteing.

#### Delete
Delete is promopted similarly to Put:
```ts
return this.http.delete('http://localhost:3000/api/channels/' + name);
```
Delete will find the record to delete, and remove it from the MongoDB. Delete will also return a new set of records, which is the same records as before, without the removed record.

## Angular Architecture
Each component in this Angular app has an associated service, this is to allow a separation between the HttpClient and the component. Furthermore, functions of a service being called by another function allows a buffer zone of sorts. Before data makes it to the HttpClient to be sent the node server, it can be manipulated in a way to ensure that it is of correct format. For instance, the ability to stop a user from deleting themselves. Before data is sent to the HttpClient, the Angular component will first ensure that user they want to delete, is not equal to the one logged in at the current time. The model of data is stored in the JSON file, anything that goes in or comes out of the JSON files is strictly enforced to be of one format. The components access the services, the services access the model.