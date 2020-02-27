var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect("Link to my online mongoDB cluster used to be here", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    console.log('connected');
    });



function userCheck(ID, cb){
    User.find({discordID:ID}, function(err, docs){
        if(docs.length){
            cb('User exist', null);
        }else cb();
    })
}

function addUser(ID,message){
    // console.log(ID);
    userCheck(ID, function(err, user){
        if(err || user){
            message.channel.send(`>>> You're already registered!`);
            return;
        }else{
            var userData = {
                discordID: ID,
                count: 0
            }
        
            var newUser = new User(userData);
        
            newUser.save();
            message.channel.send(`>>> You're in!`);
            return;
        }
    })
}

function getRandomUser(message){
    User.count().exec(function (err, count) {

    var random = Math.floor(Math.random() * count);
  
    User.findOne().skip(random).exec(
      function (err, result) {
        //   console.log(result);
        result.count += 1;
        result.save();
        message.channel.send(`>>> Random user: <@${result.discordID}>`) 
        return;
      })
  })
  return;
}

function getMyStats(ID,message){
    User.findOne({discordID: ID}, function(err, stats){
        console.log(stats)
        if(err){
            console.log(err);
            message.channel.send(`>>> You didnt registered. Please type !game`);
            return;
        }else{
            message.channel.send(`>>> <@${stats.discordID}> : ${stats.count} times.`);
            return;
        }
    })
}

function getStats(message){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
            message.channel.send('Error!');
            return;
        }else{
            var msg = `>>> `;
            var top = users.sort( (a,b) => b.count - a.count);
            // var top = users.sort( (a,b) => b.count - a.count).splice(5) When 5 or more users are in db
            console.log(top)
            for(user of top){
                msg += `<@${user.discordID}> : ${user.count} times. \n`
            }
            message.channel.send(msg);
            return;
        }
    })
}

module.exports = {addUser, getRandomUser, getMyStats, getStats};


