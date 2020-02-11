const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const log = require('./log');

const config = {
	redirect_uri : `http://localhost:3000/`,
	grant_type : `authorization_code`,
	scope : `activities.write identify`,
	listen_port : 3000,
};

const credentialsFile = `./credentials.json`;

async function load() {
	try {
		const data = fs.readFileSync(credentialsFile);
		const object = JSON.parse(data);
		if(object.client_id) {
			config.client_id = object.client_id;
			log(`Using existing client_id: ${object.client_id}`);
		}	
		if(object.client_secret) {
			config.client_secret = object.client_secret;
			log(`Using existing client_secret: ${object.client_secret}`);
		}	
		if(object.listen_port) {
			config.listen_port = object.listen_port;
			log(`Using existing listen_port: ${object.listen_port}`);
		}
		if(object.redirect_uri) {
			config.redirect_uri = object.redirect_uri;
			log(`Using existing redirect_uri: ${object.redirect_uri}`);
		}
		if(object.grant_type) {
			config.grant_type = object.grant_type;
			log(`Using existing grant_type: ${object.grant_type}`);
		}
		if(object.scope) {
			config.scope = object.scope;
			log(`Using existing scope: ${object.scope}`);
		}
		const reconfig = await inquirer.prompt([{
			message : `Would you like to change any of the above?`,
			type : `confirm`,
			name : `change`,
			default : false
		}]);
		if (reconfig.change === true) {
			start();
		}
		else {
			ready();
		}
	}
	catch (e) {
		if (e.code == "ENOENT") {
			log(`It looks like this might be the first time you've used this tool!`);
			log(`Please allow me to ask you a few questions so we can get started...`);
			start();
		}
		else {
			log(`Oh no! There's been an unexpected error. Please report this to emily@discordapp.com`);
			console.error(e);
		}
	}
}

async function start() {

	const answers = await inquirer.prompt([
		{
			type : `input`,
			name : `client_id`,
			message : `May I please have your Discord client/application ID?`,
			default : config.client_id || undefined
		},
		{
			type : `input`,
			name : `client_secret`,
			message : `May I also please have your application secret?`,
			default : config.client_secret || undefined
		},
		{
			type : `input`,
			name : `redirect_uri`,
			message : `Finally, may I have your application's OAuth redirect URL?`,
			default : config.redirect_uri || undefined
		}
	]); 

	const credentials = {
		client_id : answers.client_id,
		client_secret : answers.client_secret,
		redirect_uri : answers.redirect_uri,
		scope : `activities.write identify`,
		grant_type : `authorization_code`,
		token : null
	};

	const getPort = new URL(answers.redirect_uri);
	if (getPort.port) {
		credentials.listen_port = getPort.port;
	}
	else {
		credentials.listen_port = 80;
	}
	try {
		fs.writeFileSync(`./credentials.json`, JSON.stringify(credentials, null, 4));
		log(`Saved your credentials for future use!`);
		ready();
	}
	catch (e) {
		log(`Uh oh! Error writing credentials:`);
		log(e);
	}
}

function ready() {
	log(`Great! We should be good to go.`);
	log(`Next try ${chalk.bold(`npm run token`)} to obtain an OAuth2 token for your Discord account!`);
}

load();
