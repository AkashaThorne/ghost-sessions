const uri = `https://discordapp.com/api/v7/users/@me/headless-sessions`;
const request = require('request-promise-native');
const appCredentialsFile = './credentials.json';
const userTokenFile = './token.json';
const inquirer = require('inquirer');
const { stringify } = require('q-i');
const log = require('./log');
const chalk = require('chalk');
const fs = require('fs');
const method = 'POST';

if (!fs.existsSync(userTokenFile)) {
	log(`Oh no! We're missing your user auth. Please execute ${chalk.bold(`npm run token`)} first.`);
	process.exit(0);
}
if (!fs.existsSync(appCredentialsFile)) {
	log(`Oh no! We're missing your app credentials. Please execute ${chalk.bold(`npm run token`)} first.`);
	process.exit(0);
}

const { client_id } = JSON.parse(fs.readFileSync(appCredentialsFile));
const { access_token } = JSON.parse(fs.readFileSync(userTokenFile));

async function prompt() {
	const answers = await inquirer.prompt([
		{
			name : 'name',
			type : 'prompt',
			default : 'Cats: The Game',
			message : 'What would you like to call the game?'
		}, {
			name : 'details',
			type : 'prompt',
			default : 'I love every kind of cat',
			message : 'What details would you like to share?'
		}
	]);
	if(!answers.name || !answers.details) {
		log(`Uh oh! Missing a required field. Let's try again...`);
		return prompt();
	}
	return answers;
};

async function start() {
	const { name, details } = await prompt();
	const body = { 
		activities : [
			{	
				name,
				details,
				type : "0",
				platform : "ios",
				application_id : client_id
			}
		]
	};
	const opts = {
		uri,
		body,
		method,
		json : true,
		auth : { bearer : access_token }, 
		headers : {
			'Content-Type' : 'application/json'
		}
	};
	try {
		log(`Here's what we're sending Discord:`);
		console.log(stringify(opts));
		const result = await request(opts);
		log(`Successfully set your activity!`);
		log(`Here's what Discord sent back to us:`);
		console.log(stringify(result));
		fs.writeFileSync('./activity.json', JSON.stringify(result, null, 4));
		log(`In production, you'll need to store the ${chalk.bold('token')} that comes in the payload.`);
		log(`For now, we've saved it to ${chalk.bold(`./activity.json`)} if you want to take a look.`);
		log(`This token is required for clearing the activity, which is the next step!`);
		log(`Now! to complete the journey, execute ${chalk.bold(`npm run clear`)} next!`);
	}
	catch (e) {
		log(`* Error sending presence data: ${e}`);
		log(e);
		log(e.errors);
	}
};

start();