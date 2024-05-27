const { Client, Collection } = require(`discord.js`);
const { readdirSync } = require(`fs`);
const { join } = require(`path`);
const mongoose = require(`mongoose`);
const EmbedManager = require(`djsembedmanager`);
const LogManager = require("./LogManager");

class Bot extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.token = process.env.token;
        this.db_uri = process.env.mongo;
        this.embeds = new EmbedManager(this);
        this.cooldowns = new Collection();
        this.logs = new LogManager(this, '1104042001969713179', mongoose)
    }

    async start() {
        await this.loadCommands();
        await this.loadEvents();
        await this.loadDatabase();
        this.login(this.token);
    }

    async loadEvents() {
        readdirSync(join(__dirname, `../events`)).forEach(file => {
            const Event = require(join(__dirname, `../events/${file}`));
            const event = new Event();
            this.on(event.name, (...args) => event.run(this, ...args));
        });
    };

    async loadCommands() {
        readdirSync(join(__dirname, `../commands`)).forEach(folder => {
            readdirSync(join(__dirname, `../commands/${folder}`)).forEach(file => {
                const Command = require(join(__dirname, `../commands/${folder}/${file}`));
                const command = new Command();
                this.commands.set(command.name, command);
            });
        });
    };

    async loadDatabase() {
        await mongoose.connect(this.db_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
        }).catch(err => console.log(err) && process.exit(1));

        this.db = mongoose;

        readdirSync(join(__dirname, `../models`)).forEach(file => {
            require(join(__dirname, `../models/${file}`));
        });

        console.log(`Connected to database models loaded.`);

        this.models = {
            guilds: mongoose.model(`Guild`),
            users: mongoose.model(`User`),
            Guild: mongoose.model(`Guild`),
            User: mongoose.model(`User`),
        }

        this.guildDB = await this.models.guilds.find();
    }
}

module.exports = Bot;
