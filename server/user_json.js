const fs = require('fs');
module.exports = function(app, fs){

    app.get('/api/users', (res) => {
        var usersJSON;
        fs.readUsers('./data/users.json', 'utf8', function(err, data){
            if (err) {
                console.log(err);
            } else {
                usersJSON = JSON.parse(data);
                console.log(usersJSON);
                res.send(usersJSON);
            }
        });
    });
}