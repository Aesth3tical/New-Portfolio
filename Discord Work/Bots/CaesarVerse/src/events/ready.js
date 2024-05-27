const Event = require("../classes/Event");

class Ready extends Event {
    constructor() {
        super("ready");
    }

    async run(client) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
}

module.exports = Ready;
