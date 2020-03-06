module.exports = {
    getUserFromMention: function (mention) {
        const matches = mention.match(/^<@!?(\d+)>$/);
    
        if (!matches) return;
    
        const id = matches[1]
    
        return client.users.get(id);
    }
}