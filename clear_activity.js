const uri = `https://discordapp.com/api/v7/users/@me/headless-sessions/delete`;
const request = require('request-promise-native');
const { stringify } = require('q-i');
const chalk = require('chalk');
const log = require('./log');
const fs = require('fs');
const method = 'POST';

const userTokenFile = './token.json';
const activityFile = './activity.json';
const credentialsFile = './credentials.json';

if (!fs.existsSync(credentialsFile)) {
	log(`Oh no! We're missing your app credentials.`);
	log(`Please try executing the ${chalk.bold(`npm run setup`)} command first!`);
	process.exit(0);
}
if (!fs.existsSync(userTokenFile)) {
	log(`Oh no! We're missing your user auth. Please execute ${chalk.bold(`npm run token`)} first.`);
	process.exit(0);
}
if (!fs.existsSync(activityFile)) {
	log(`Oh no! We have no activity to clear! Maybe you already did?`);
	log(`Please set an activity first by executing the ${chalk.bold(`npm run set`)} command.`);
	process.exit(0);
}

const { token } = JSON.parse(fs.readFileSync(activityFile));
const { access_token } = JSON.parse(fs.readFileSync(userTokenFile));

const opts = {
	uri,
	body : { token },
	method,
	json : true,
	auth : { bearer : access_token },
	headers : {
		'Content-Type' : 'application/json'
	}
};
async function clearActivity() {
	try {
		const result = await request(opts);
		log(`Cleared your most recent game activity with activity token: ${chalk.bold(token)}`);
		log(`${chalk.bold(`NOTE:`)} activities take ${chalk.bold(`2 minutes`)} to clear once the command is issued.`);
		fs.unlinkSync('./activity.json'); 
	}
	catch (e) {
		log(`* Error clearing presence data: ${e}`);
		log(e);
		log(e.errors);
	}
}

clearActivity();