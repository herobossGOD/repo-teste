const { Client, Collection } = require('discord.js');

const Embed = require('./Embed.js');

const { readdirSync } = require('fs');

const chalk = require('chalk');

const _ = require('lodash')

module.exports = class LegitClient extends Client {
    constructor(options) {
        super(options);

        this.embed = Embed;

        this.events = new Collection();

        this.commands = new Collection();
        
        this.mutes = new Collection();
    }

    async login() {
        return super.login(process.env.TOKEN)
    }

    log(message, {
        tags = [],
        bold = false,
        italic = false,
        underline = false,
        reversed = false,
        bgColor = false,
        color = 'white'
    } = {}) {
        const colorFunction = _.get(chalk, [bold, italic, underline, reversed, bgColor, color].filter(Boolean).join('.'));

        console.log(...tags.map(t => chalk.cyan(`[${t}]`)), colorFunction(message))
    }

    async loadModules() {
        const modules = readdirSync('src/modules/');

        modules.forEach(file => {
            const module = require(`../modules/${file}`);

            new module(this).start();
        })
    }
    
    async connectdatabase() {
        const firebase = require('firebase');
        
    	firebase.initializeApp({
      		apiKey: process.env.FIREBASE_API,
      		authDomain: process.env.FIREBASE_DOMAIN,
      		databaseURL: process.env.FIREBASE_URL,
      		projectId: process.env.FIREBASE_PROJECTID,
      		storageBucket: process.env.FIREBASE_STORAGE,
      		messagingSenderId: process.env.FIREBASE_SENDER,
      		appId: process.env.FIREBASE_APPID,
      		measurementId: process.env.FIREBASE_MEASURE
    	});
        
    	this.database = firebase.database();
    	return this.log(`[FIREBASE] - Firebase conectado com sucesso.`, { tags: ['Banco de dados'], color: 'green'})
    }
}