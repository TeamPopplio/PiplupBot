exports.description = "Sends a random image taken from a subreddit."

var randomPuppy = require('random-puppy');
exports.action = (message, args) => {
    randomPuppy(args.join("")).then(puppy => message.channel.send(puppy))
}