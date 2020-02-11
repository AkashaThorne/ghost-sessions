const tokenFile = './token.json';
const credentialsFile = './credentials.json';
const request = require('request-promise-native');
const { stringify } = require('q-i');
const express = require('express');
const chalk = require('chalk');
const open = require('open');
const log = require('./log');
const fs = require('fs');
const app = express();
let config;

try {
	config = JSON.parse(fs.readFileSync(credentialsFile));
}
catch (e) {
	log(`Uh oh! Error loading your application credentials.`);
	log(`Please try executing the ${chalk.bold(`npm run setup`)} command first!`);
	process.exit(0);
}

const method = 'POST';
const uri = 'https://discordapp.com/api/v7/oauth2/token';
const { 
	scope, 
	client_id, 
	client_secret, 
	redirect_uri, 
	listen_port,
	grant_type,
} = config;

const authUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURI(redirect_uri)}&response_type=code&scope=${scope}`;

/** 
 * Serve incoming GET requests to retrieve the 
 * code and exchange for token
 * */
app.get('/', async (req, res) => {
	const code = req.query.code;
	if (!code) return res.sendStatus(400);
	try { 
		const token = await tokenExchange(code);
		res.sendStatus(200);

		log(`Great work! Now let's try setting an ${chalk.bold('activity!')}`);
		log(`Use the command ${chalk.bold(`npm run set`)} to try it now!`);
		process.exit(0);
	}
	catch (e) {
		log(`Oh no! Error with incoming request from Discord:`);
		log(e);
		process.exit(0);
	}
});

app.listen(listen_port, () => {
	log(`Listening on port ${chalk.bold(listen_port)}`);
	log(`Opening your default browser to authorize your Discord app to your Discord user account...`);
	open(authUrl);
});

/**
 * 
 * @param {string} code - Discord's OAuth2 code 
 * 
 * Takes the code given by Discord and attempts to
 * exchange it for an actual auth token that can be
 * used for API calls on behalf of the user
 * */
async function tokenExchange(code) {
	log(`Retrieving token for code: ${chalk.bold(code)}`);
	/**
	 * This is the data we'll be delivering as a form body
	 * Sent as content type `application/x-www-form-urlencoded`
	 * */
	const form = {
		code,
		scope,
		client_id, 
		client_secret, 
		redirect_uri,
		grant_type,
	};
	const opts = {
		uri, 
		form,
		method,
		json : true,
	};
	log(`HTTP request to be sent for token exchange:`);
	console.log(stringify(opts) + `\r\n`);
	try {
		/**
	 	* Attempt to retrieve token from Discord:
		* */
		log(`Successfully obtained OAuth2 information for user:`);
		const result = await request(opts);
		console.log(stringify(result) + `\r\n`);
		fs.writeFileSync(tokenFile, JSON.stringify(result, null, 4));
		return result;
	}
	catch (e) {
		/**
		 * Oh no! most likely there was an issue with your
		 * query parameters. Things to double check:
		 * 
		 * - redirect_url -- must match what you set in the developer portal
		 * - client_id -- must be the one we whitelisted for you
		 * - client_secret -- make sure it wasn't reset in the developer portal
		 * 
		 * The HTTP error provided here may give you some clues:
		 * 
		 * 400 -- malformed request; make sure it's a query string, not form body
		 * 401 -- bad credentials; double check on `client_id` and `client_secret`
		 * 405 -- maybe you didn't send as a POST request
		 * */
		log(`Oh no! Error with token exchange:`);
		log(e);
	}
};
