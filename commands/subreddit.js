exports.description = "Sends a random image taken from a subreddit."

const randomPuppy = require('random-puppy');
exports.action = (message, args) => {
    randomPuppy(args.join("")).then(puppy => message.channel.send(puppy))
}