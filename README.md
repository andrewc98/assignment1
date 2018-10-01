## Git
The git repository maintains the same structure as was seen in assignment 1, just the singular master branch. Unlike last time, no attempts at branching were made, which resulted in not encountering any branching issues. A straight forward singular branch ensured that when I did encounter a problem, I was able to reverse back to before the problem was created. This form of version control has worked successfully in the previous assessment, and continued to in this current one. Furthermore, this assignment was completed by me alone, so there was less of a need to implement branches.

## Data Structures
#### User
{
    name: "Andrew",
    password: "123456789",
    access_level: 1,
    email: "me@hotmail.com"
}
This is an example of the structure of one of my user objects. It should also be noted that there is also an attribute of "_id" for all objects, but that is automatically created by MongoDB and is not used in this project. The user object holds four attributes, name, password, and email. To login, a person my input a matching set of "name" and "username". The "access_level" denotes what permissions the user has been given. With 1 being a normal user, 2 is a group admin, and 3 is a super admin.

#### Channel
{
    name: "Tennis",
    users: [ "Roger", "Novak", "Rafael" ]
}
This type of data stucture is used to store channels. The name of the channel is stored in the "name" attribute. The users had only their name stored in an array in the "users" attribute.

#### Group
{
    name: "Sport",
    channels: [ { name: "Tennis", users: [ "Roger", "Novak", "Rafael" ] }, { name: "Rubgy League", users: [ "Johnathan", "Billy", "Ben" ] } ],
    users: [ "Roger", "Novak", "Rafael", "Johnathan", "Billy", "Ben" ]
}
Groups has a more detailed way of storing data. The name of the group and the users added to it are stored in "name" and "users", repspectively, but channels stores an instance of a channel. Doing it this way makes it difficult to perform actions on channels, because there are two places to store it, but it ultimately works out.

#### Chat
{
    name: "Tennis",
    messages: ["Andrew joined the chat", "[Andrew] Hi and Bye", "Andrew left the chat"]
}
Each record in chat stores the name of the channel the chat appears in, and the messages are held in an array under the "messages" attribute. Messages are appended in order of arrival, so it's guarentee that the messages will always be in the correct order.


## REST API
#### Get
The REST API is done by the use of the use of the HttpClient, which includes four routes, which were used multiple times. To call the Node server and receive the users JSON file, a URL of ”http://localhost:3000/api/users” has to be hit, with the “get” function. The Node server is constantly watching the 3000 port on that URL for a hit. Once that URL is hit, it will parse back the user JSON file, no parameters are needed for this route. However, the dashboard, which displays only the groups the user is in does take parameters. It takes the parameters of the user’s name and their access level. It uses the username to determine which groups and channels the user has been included in, which it will return back. The benefit of doing it this way, rather than filtering the data on the Angular side is to prevent any data that the user doesn’t need from being returned. Data can be displayed like normal on the Angular side because it’s the correct data.

#### Post
Post function is called in a way much the same as the get method, but the URL "http://localhost:3000/api/users/". Unlike the get function, creating a user’s post must be parsed a parameter of the user to add. The user object is sent to the Node backend and compared with everything else in the data. If the user already exists, then they cannot add that user, so nothing will happen. Alternatively, if the user is unique and can be added, they will be added to the database and the client’s page will be updated seamlessly. The next function to use is the put function.

#### Put
The put function is used to update an existing object, and it’s called in a much different way to get and post. The URL of "http://localhost:3000/api/users/:user_name" must be called, where the username is equal to the username of the user who will be changed. Additionally, a body parameter is parsed through with it, the body contains the full details of the user to change, and the part to change to. The only allowed part to change of a user is the access level, which is the aforementioned rating of one to three. Like the previous functions, all of the calculations are done in the Node server. Lastly, the delete function.

#### Delete
The delete function is also called in way similar to the put function. “http://localhost:3000/api/users/:user_name”, unlike the put function, delete does not need any other parameters to work with. All of the connections between the different objects in the model are calculated by the Node server, which it will then delete those connections, and the data with it. Allowing the Node server to do all of the heavy lifting allows the client to seamless transfer between different pages without the presence of any notable pauses.

## Angular Architecture
Each component in this Angular app has an associated service, this is to allow a separation between the HttpClient and the component. Furthermore, functions of a service being called by another function allows a buffer zone of sorts. Before data makes it to the HttpClient to be sent the node server, it can be manipulated in a way to ensure that it is of correct format. For instance, the ability to stop a user from deleting themselves. Before data is sent to the HttpClient, the Angular component will first ensure that user they want to delete, is not equal to the one logged in at the current time. The model of data is stored in the JSON file, anything that goes in or comes out of the JSON files is strictly enforced to be of one format. The components access the services, the services access the model.