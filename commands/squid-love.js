const { getUserFromMention } = require ("../tools");

module.exports = {
    name: 'squid-love',
    description: 'Send a barrage of squid love to a specified user!',
    aliases: ['love'],
    usage: '<@user>',
    cooldown: 60,
    execute(message, args) {

        const taggedUser = getUserFromMention;
        if (!taggedUser) {
            //Do something
        }
    }
}


