const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const mongoose = require('mongoose');
const EmbedManager = require('./EmbedManager');

class BotClient extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.token = process.env.TOKEN;
        this.db_uri = process.env.MONGO_URI;
        this.embeds = new EmbedManager(this);
    }

    async start() {
        await this.loadEvents();
        await this.loadCommands();
        await this.loadDatabase();
        this.login(this.token)
    }

    async loadEvents() {
        readdirSync(join(__dirname, '../events')).forEach(file => {
            const Event = require(join(__dirname, `../events/${file}`));
            const event = new Event();
            this.on(event.name, (...args) => event.run(this, ...args));
        })
    };

    async loadCommands() {
        readdirSync(join(__dirname, '../commands')).forEach(folder => {
            readdirSync(join(__dirname, `../commands/${folder}`)).forEach(file => {
                const Command = require(join(__dirname, `../commands/${folder}/${file}`));
                const command = new Command();
                this.commands.set(command.name, command);
            })
        })
    };

    async loadDatabase() {
        await mongoose.connect(this.db_uri, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.db = mongoose;

        readdirSync(join(__dirname, '../models'), { withFileTypes: true }).forEach(file => {
            if (file.isFile()) {
                console.log(`Loaded model for collection ${require(join(__dirname, `../models/${file.name}`)).collection.name}`)
            }
        })

        this.models = {
            guilds: mongoose.model('Guild'),
            users: mongoose.model('User'),
            logs: mongoose.model('Log'),
            Guild: mongoose.model('Guild'),
            User: mongoose.model('User'),
            Log: mongoose.model('Log')
        }
    };
}

module.exports = BotClient;